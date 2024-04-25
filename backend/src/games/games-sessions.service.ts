import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { RoomsService } from 'src/rooms';
import { EventsGateway } from 'src/events';
import {
  CurrentQuestionType,
  Game,
  Room,
  addSecondsToDate,
  wait,
} from 'src/shared';
import { CreateGameSessionDto } from './dto/create-game-session.dto';

const temporaryQuestions: CurrentQuestionType[] = [
  {
    question: 'Question 1',
    answers: new Map([
      ['2', { name: 'True', isCorrect: true }],
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['3', { name: 'Not' }],
    ]),
  },
  {
    question: 'Question 2',
    answers: new Map([
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['3', { name: 'Not' }],
      ['2', { name: 'True 2', isCorrect: true }],
    ]),
  },
  {
    question: 'Question 3',
    answers: new Map([
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['2', { name: 'True 3', isCorrect: true }],
      ['3', { name: 'Not' }],
    ]),
  },
  {
    question: 'Question 4',
    answers: new Map([
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['2', { name: 'True 4', isCorrect: true }],
      ['3', { name: 'Not' }],
    ]),
  },
  {
    question: 'Question 5',
    answers: new Map([
      ['2', { name: 'True 5', isCorrect: true }],
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['3', { name: 'Not' }],
    ]),
  },
  {
    question: 'Question 6',
    answers: new Map([
      ['0', { name: 'Not true' }],
      ['1', { name: 'Not true 2' }],
      ['3', { name: 'Not' }],
      ['2', { name: 'True 6', isCorrect: true }],
    ]),
  },
  {
    question: 'Question 7',
    answers: new Map([
      ['2', { name: 'True 7 1', isCorrect: true }],
      ['2', { name: 'True 7 2', isCorrect: true }],
      ['1', { name: 'Not true 2' }],
      ['3', { name: 'Not' }],
    ]),
  },
];

@Injectable()
export class GamesSessionsService {
  private ongoingGamesTimers: Map<string, NodeJS.Timeout> = new Map();
  constructor(
    private readonly gameService: GamesService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomService: RoomsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createAndStartSession(data: CreateGameSessionDto): Promise<Game> {
    const { gameStartInMs, ...restData } = data;
    const gameStartIn = gameStartInMs || 5000;

    const game = await this.gameService.create({
      ...restData,
      currentTimer: {
        stage: 'GAME STARTING',
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
        stage: 'NEW QUESTION',
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
  }

  private async handleQuestionLogicStage(
    data: Pick<Game, '_id' | 'currentQuestionNumber' | 'options'>,
    roomCode: Room['code'],
  ) {
    const { _id, currentQuestionNumber, options } = data;
    const updatedGame = await this.gameService.update(_id, {
      currentQuestionNumber: currentQuestionNumber + 1,
      currentQuestion: temporaryQuestions[currentQuestionNumber],
      currentPlayersAnswers: new Map(),
      currentTimer: {
        stage: 'QUESTION',
        date: addSecondsToDate(options.timeForShowQuestionAnswersMs / 1000),
      },
    });
    this.eventsGateway.server.to(roomCode).emit('showNewQuestionInGame', {
      data: updatedGame,
      questionText: updatedGame.currentQuestion.question,
    });

    await wait(updatedGame.options.timeForShowQuestionAnswersMs);

    return this.handleAnswerTimeStage(updatedGame, roomCode);
  }

  private async handleAnswerTimeStage(
    data: Pick<Game, '_id' | 'options'>,
    roomCode: Room['code'],
  ) {
    const { _id, options } = data;
    const updatedGameWithPossibleAnswers = await this.gameService.update(_id, {
      canAnswer: true,
      currentTimer: {
        stage: 'ANSWER TIME',
        date: addSecondsToDate(options.timeForAnswerMs / 1000),
      },
    });

    this.eventsGateway.server
      .to(roomCode)
      .emit('showQuestionPossibleAnswers', updatedGameWithPossibleAnswers);

    return updatedGameWithPossibleAnswers;
  }

  private async handleShowCorrectAnswersStage(
    data: Pick<Game, '_id' | 'options'>,
    roomCode: Room['code'],
  ) {
    const { _id, options } = data;
    const gameWithShowAnswers = await this.gameService.update(_id, {
      canAnswer: false,
      currentTimer: {
        stage: 'QUESTION RESULT',
        date: addSecondsToDate(options.timeForShowQuestionResult / 1000),
      },
    });
    this.eventsGateway.server
      .to(roomCode)
      .emit('showCurrentQuestionAnswersInGame', gameWithShowAnswers);
    //TODO: scores
    // Emit here which question is correct add points etc

    return gameWithShowAnswers;
  }
}
