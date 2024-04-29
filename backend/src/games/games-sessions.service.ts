import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { RoomsService } from 'src/rooms';
import { EventsGateway } from 'src/events';
import {
  CurrentTimerGameStage,
  Game,
  PlayerDataGame,
  Room,
  addSecondsToDate,
  wait,
} from 'src/shared';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class GamesSessionsService {
  private ongoingGamesTimers: Map<string, NodeJS.Timeout> = new Map();
  constructor(
    private readonly gameService: GamesService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomService: RoomsService,
    private readonly questionsService: QuestionsService,
    private readonly categoriesService: CategoriesService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createAndStartSession(data: CreateGameSessionDto): Promise<Game> {
    const { gameStartInMs, ...restData } = data;
    const gameStartIn = gameStartInMs || 5000;

    const game = await this.gameService.create({
      ...restData,
      playersData: new Map(
        restData.room.players.map((player) => [player._id, { score: 0 }]),
      ),
      currentTimer: {
        stage: CurrentTimerGameStage.GAME_STARTING,
        date: addSecondsToDate(gameStartIn / 1000),
      },
    });

    //TOOD: note temporary solution - delay 1s
    await wait(1000);
    this.ongoingGamesTimers.set(
      game._id,
      await this.gameTimeout(game, restData.room.code, gameStartIn),
    );
    return game;
  }

  async gameTimeout(game: Game, roomCode: Room['code'], delay?: number) {
    this.eventsGateway.server.to(roomCode).emit('updateGameStage', game);
    return setTimeout(async () => {
      const updatedGame = await this.handleGameStages(game, roomCode);

      if (!updatedGame) return;
      await this.gameTimeout(updatedGame, roomCode, 1);
    }, delay || game.options.timeForNextQuestionMs);
  }

  private async handleGameStages(game: Game, roomCode: Room['code']) {
    const answerTimeUpdate = await this.handleQuestionLogicStage(
      game,
      roomCode,
    );
    if (game.currentQuestionNumber >= game.options.questionsCount)
      return this.handleEndGameStage(game._id, game.room._id, roomCode);

    await wait(answerTimeUpdate.options.timeForAnswerMs);

    const correctAnswersUpdate = await this.handleShowCorrectAnswersStage(
      answerTimeUpdate,
      roomCode,
    );
    await wait(correctAnswersUpdate.options.timeForShowQuestionResult);

    const updatedGame = await this.handleNewQuestionStage(
      correctAnswersUpdate,
      roomCode,
    );
    await wait(updatedGame.options.timeForNextQuestionMs);

    return updatedGame;
  }

  private async handleNewQuestionStage(
    data: Pick<Game, '_id' | 'options'>,
    roomCode: Room['code'],
  ) {
    const { _id, options } = data;
    const updatedGame = await this.gameService.update(_id, {
      currentTimer: {
        stage: CurrentTimerGameStage.NEW_QUESTION,
        date: addSecondsToDate(options.timeForNextQuestionMs / 1000),
      },
    });
    this.eventsGateway.server.to(roomCode).emit('updateGameStage', updatedGame);
    return updatedGame;
  }

  private async handleEndGameStage(
    gameId: string,
    roomId: string,
    roomCode: Room['code'],
  ) {
    await this.roomService.update(roomId, { game: null, playersReadiness: [] });

    this.eventsGateway.server
      .to(roomCode)
      .emit(
        'endGame',
        await this.gameService.update(gameId, { isFinished: true }),
      );

    await this.gameService.remove(gameId);
  }

  private async handleQuestionLogicStage(
    data: Pick<
      Game,
      '_id' | 'currentQuestionNumber' | 'options' | 'playersData'
    >,
    roomCode: Room['code'],
  ) {
    const updatedGame = await this.updateGameForNewQuestion(data);
    this.eventsGateway.server.to(roomCode).emit('showNewQuestionInGame', {
      data: updatedGame,
      questionData: updatedGame.currentQuestion,
    });

    await wait(updatedGame.options.timeForShowQuestionAnswersMs);

    return this.handleAnswerTimeStage(updatedGame, roomCode);
  }

  private async updateGameForNewQuestion(
    data: Pick<
      Game,
      '_id' | 'currentQuestionNumber' | 'options' | 'playersData'
    >,
  ) {
    const { _id, currentQuestionNumber, options, playersData } = data;

    const newPlayersData = new Map(
      [...playersData].map(([id, data]) => {
        return [id, { score: data.score } as PlayerDataGame];
      }),
    );
    const randomCategory = await this.categoriesService.getRandomCategory();
    const randomQuestion =
      await this.questionsService.getRandomQuestionByCategoryId(
        randomCategory._id,
      );

    const updatedGame = await this.gameService.update(_id, {
      currentQuestionNumber: currentQuestionNumber + 1,
      currentQuestion: randomQuestion,
      currentCategory: randomCategory,
      playersData: newPlayersData,
      currentTimer: {
        stage: CurrentTimerGameStage.QUESTION,
        date: addSecondsToDate(options.timeForShowQuestionAnswersMs / 1000),
      },
    });
    return updatedGame;
  }

  private async handleAnswerTimeStage(
    data: Pick<Game, '_id' | 'options'>,
    roomCode: Room['code'],
  ) {
    const { _id, options } = data;
    const updatedGameWithPossibleAnswers = await this.gameService.update(_id, {
      canAnswer: true,
      currentTimer: {
        stage: CurrentTimerGameStage.ANSWER_TIME,
        date: addSecondsToDate(options.timeForAnswerMs / 1000),
      },
    });

    this.eventsGateway.server
      .to(roomCode)
      .emit('showQuestionPossibleAnswers', updatedGameWithPossibleAnswers);

    return updatedGameWithPossibleAnswers;
  }

  private async handleShowCorrectAnswersStage(
    data: Pick<Game, '_id' | 'options' | 'playersData'>,
    roomCode: Room['code'],
  ) {
    const { _id, options } = data;
    const gameWithShowAnswers = await this.gameService.update(_id, {
      canAnswer: false,
      currentTimer: {
        stage: CurrentTimerGameStage.QUESTION_RESULT,
        date: addSecondsToDate(options.timeForShowQuestionResult / 1000),
      },
    });
    this.eventsGateway.server
      .to(roomCode)
      .emit('showQuestionCorrectAnswersInGame', gameWithShowAnswers);
    //TODO: scores
    // Emit here which question is correct add points etc
    await this.handleScorePointsPlayersLogic(gameWithShowAnswers);
    return gameWithShowAnswers;
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
