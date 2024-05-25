import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { RoomsService } from 'src/rooms';
import { EventsGateway } from 'src/events';
import {
  CurrentTimerGameStage,
  Game,
  PlayerDataGame,
  Room,
  TimeoutType,
  addSecondsToDate,
} from 'src/shared';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { CategoriesService } from 'src/categories/categories.service';
import { GameTimerData } from './game-timer-data.class';

type OnStagesTimeoutReturnType = {
  timeout: TimeoutType;
  game: Game;
};

type GetStageDetailsReturnType = {
  nextStageDelay: number;
  onStageFn: (
    game: Game,
    roomData: Room,
    nextStageDelay: number,
  ) => Promise<Game>;
};
@Injectable()
export class GamesSessionsService {
  private ongoingGamesTimers: Map<string, GameTimerData> = new Map();
  constructor(
    private readonly gameService: GamesService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomService: RoomsService,
    private readonly questionsService: QuestionsService,
    private readonly categoriesService: CategoriesService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createAndStartSession(data: CreateGameSessionDto): Promise<Game> {
    const createdGame = await this.onGameCreate(data);
    this.ongoingGamesTimers.set(
      String(createdGame._id), //Casting to ensure that it will be string. Problems with Mongo ObjectIds,
      new GameTimerData({ currentStage: createdGame.currentTimer.stage }),
    );
    const { game } = await this.onStagesTimeout(createdGame, data.room);
    return game;
  }

  private getStageDetails(
    data: Pick<Game, 'options' | 'currentTimer' | 'currentQuestionNumber'>,
    isEnded: boolean,
  ): GetStageDetailsReturnType {
    const options = data.options;
    switch (data.currentTimer.stage) {
      case CurrentTimerGameStage.GAME_ENDING:
        return {
          nextStageDelay: options.endGameMs,
          onStageFn: this.endGame.bind(this),
        };
      case CurrentTimerGameStage.GAME_STARTING:
        return {
          nextStageDelay: options.startGameMs,
          onStageFn: this.onGameQuestionStage.bind(this),
        };
      case CurrentTimerGameStage.QUESTION_RESULT:
        return {
          nextStageDelay: options.showQuestionResultMs,
          onStageFn: isEnded
            ? this.onEndGameStage.bind(this)
            : this.onNewQuestionStage.bind(this),
        };
      case CurrentTimerGameStage.NEW_QUESTION:
        return {
          nextStageDelay: options.nextQuestionMs,
          onStageFn: this.onGameQuestionStage.bind(this),
        };
      case CurrentTimerGameStage.ANSWER_TIME:
        return {
          nextStageDelay: options.answerTimeMs,
          onStageFn: this.onShowCorrectAnswersStage.bind(this),
        };
      case CurrentTimerGameStage.QUESTION:
        return {
          nextStageDelay: options.showQuestionAnswersMs,
          onStageFn: this.onAnswerTimeStage.bind(this),
        };
    }
  }

  private async onStagesTimeout(
    game: Game,
    room: Room,
    delay?: number,
  ): Promise<OnStagesTimeoutReturnType> {
    let updatedGameInstance: Game = game;
    const isEnded =
      updatedGameInstance.currentTimer.stage ===
        CurrentTimerGameStage.QUESTION_RESULT &&
      updatedGameInstance.currentQuestionNumber >=
        updatedGameInstance.options.questionsCount
        ? true
        : false;
    const stageDetails = this.getStageDetails(updatedGameInstance, isEnded);

    const timeout = setTimeout(async () => {
      updatedGameInstance = await stageDetails.onStageFn(
        updatedGameInstance,
        room,
        stageDetails.nextStageDelay,
      );

      this.ongoingGamesTimers
        .get(String(updatedGameInstance._id))
        ?.setCurrentTimer(
          (
            await this.onStagesTimeout(
              updatedGameInstance,
              room,
              stageDetails.nextStageDelay,
            )
          ).timeout,
        );
    }, delay || stageDetails.nextStageDelay);

    return { timeout, game: updatedGameInstance };
  }

  private async onShowCorrectAnswersStage(
    data: Pick<Game, '_id' | 'playersData'>,
    roomData: Pick<Room, 'code'>,
    delayMs: number,
  ) {
    const { _id } = data;
    const gameWithShowAnswers = await this.gameService.update(_id, {
      canAnswer: false,
      currentTimer: {
        stage: CurrentTimerGameStage.QUESTION_RESULT,
        date: addSecondsToDate(delayMs / 1000),
      },
    });
    this.eventsGateway.server
      .to(roomData.code)
      .emit('showQuestionCorrectAnswersInGame', gameWithShowAnswers);
    //TODO: scores
    // Emit here which question is correct add points etc
    await this.handleScorePointsPlayersLogic(gameWithShowAnswers);
    return gameWithShowAnswers;
  }
  private async onNewQuestionStage(
    data: Pick<Game, '_id'>,
    roomData: Pick<Room, 'code'>,
    delayMs: number,
  ) {
    const { _id } = data;
    const updatedGame = await this.gameService.update(_id, {
      currentTimer: {
        stage: CurrentTimerGameStage.NEW_QUESTION,
        date: addSecondsToDate(delayMs / 1000),
      },
    });
    this.eventsGateway.server
      .to(roomData.code)
      .emit('updateGameStage', updatedGame);
    return updatedGame;
  }

  private async onAnswerTimeStage(
    data: Pick<Game, '_id'>,
    roomData: Pick<Room, 'code'>,
    delayMs: number,
  ) {
    const { _id } = data;
    const updatedGameWithPossibleAnswers = await this.gameService.update(_id, {
      canAnswer: true,
      currentTimer: {
        stage: CurrentTimerGameStage.ANSWER_TIME,
        date: addSecondsToDate(delayMs / 1000),
      },
    });

    this.eventsGateway.server
      .to(roomData.code)
      .emit('showQuestionPossibleAnswers', updatedGameWithPossibleAnswers);

    return updatedGameWithPossibleAnswers;
  }

  private async onGameQuestionStage(
    data: Pick<Game, '_id' | 'currentQuestionNumber' | 'playersData'>,
    roomData: Pick<Room, 'code'>,
    delayMs: number,
  ) {
    const { _id: gameId, playersData, currentQuestionNumber } = data;
    const newPlayersData = new Map(
      [...playersData].map(([id, data]) => {
        return [id, { score: data.score } as PlayerDataGame];
      }),
    );
    const randomCategory = await this.categoriesService.getRandomCategory();
    //TODO: note - thats temporary solution till I do choosing category etc, etc
    //Also ensure that game has at least some questions in each category etc..
    if (!randomCategory) return;

    const randomQuestion =
      await this.questionsService.getRandomQuestionByCategoryId(
        randomCategory._id,
      );

    const updatedGame = await this.gameService.update(gameId, {
      currentQuestionNumber: currentQuestionNumber + 1,
      currentQuestion: randomQuestion,
      currentCategory: randomCategory,
      playersData: newPlayersData,
      currentTimer: {
        stage: CurrentTimerGameStage.QUESTION,
        date: addSecondsToDate(delayMs / 1000),
      },
    });
    this.eventsGateway.server.to(roomData.code).emit('showNewQuestionInGame', {
      data: updatedGame,
      questionData: updatedGame.currentQuestion,
    });
    return updatedGame;
  }

  private async onGameCreate(data: CreateGameSessionDto) {
    const game = await this.gameService.create({
      ...data,
      playersData: new Map(
        data.room.players.map((player) => [player._id, { score: 0 }]),
      ),
      currentTimer: {
        stage: CurrentTimerGameStage.GAME_STARTING,
        date: addSecondsToDate(data.options.startGameMs / 1000 || 2000),
      },
    });

    return game;
  }

  private async onEndGameStage(
    data: Pick<Game, '_id' | 'currentQuestionNumber' | 'room'>,
    roomData: Pick<Room, '_id' | 'code'>,
    delayMs: number,
  ) {
    await this.roomService.update(roomData._id, {
      game: null,
      playersReadiness: [],
    });

    const game = await this.gameService.update(data._id, {
      currentTimer: {
        stage: CurrentTimerGameStage.GAME_ENDING,
        date: addSecondsToDate(delayMs / 1000),
      },
    });

    this.eventsGateway.server.to(roomData.code).emit('updateGameStage', game);
    return game;
  }

  private async endGame(
    data: Game,
    roomData: Pick<Room, 'code'>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _delayMs: number,
  ) {
    this.eventsGateway.server
      .to(roomData.code)
      .emit(
        'endGame',
        await this.gameService.update(data._id, { isFinished: true }),
      );
    this.ongoingGamesTimers.get(String(data._id)).stopTimer();
    this.ongoingGamesTimers.delete(String(data._id));
    await this.gameService.remove(data._id);
    return data;
  }

  private async handleScorePointsPlayersLogic(
    data: Pick<Game, '_id' | 'options' | 'playersData' | 'currentQuestion'>,
  ) {
    const playersDataInst = new Map(data.playersData);

    data.playersData.forEach((value, key) => {
      const madeCorrectAnswer = value.currentAnswer
        ? Object.entries(data.currentQuestion.answers).find(
            ([answerId]) => answerId === value.currentAnswer,
          )[1].isCorrect
        : null;

      const scoreValue = madeCorrectAnswer
        ? data.options.pointsPerCorrect
        : data.options.pointsPerWrong;

      if (playersDataInst.has(key)) {
        const previousPlayerData = playersDataInst.get(key);

        const newScoreValue = Math.max(
          0,
          previousPlayerData.score + scoreValue,
        );
        playersDataInst.set(key, {
          ...previousPlayerData,
          score: newScoreValue,
        });
      } else {
        playersDataInst.set(key, {
          score: Math.max(0, scoreValue),
        });
      }
    });

    await this.gameService.update(data._id, {
      playersData: playersDataInst,
    });
  }
}
