import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';

import { CurrentQuestionType, addSecondsToDate, wait } from 'src/shared';

import { UpdateGameDto } from './dto/update-game.dto';
import { EventsGateway } from 'src/events';
type FilterQueryGameType = FilterQuery<Game>;
type ProjectonType = ProjectionType<Game>;

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
export class GamesService {
  private ongoingGamesTimers: Map<string, NodeJS.Timeout> = new Map();
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createAndStartSession(data: CreateGameDto): Promise<Game> {
    const { gameStartInMs, ...restData } = data;
    const gameStartIn = gameStartInMs || 5000;
    const createdGame = new this.gameModel({
      ...restData,
      currentTimer: {
        stage: 'GAME STARTING',
        date: addSecondsToDate(gameStartIn / 1000),
      },
    });

    const game = await createdGame.save();

    //TOOD: note temporary solution - delay 1s
    await wait(1000);
    this.ongoingGamesTimers.set(
      createdGame._id,
      await this.gameTimeout(game, gameStartIn),
    );
    return game;
  }

  async gameTimeout(game: Game, delay?: number) {
    this.eventsGateway.server.emit('updateGameStage', game);
    return setTimeout(async () => {
      const updatedGame = await this.handleGameStages(game);

      if (!updatedGame) return;
      await this.gameTimeout(updatedGame, 1);
    }, delay || game.options.timeForNextQuestionMs);
  }

  private async handleGameStages(game: Game) {
    const answerTimeUpdate = await this.handleQuestionLogicStage(game);
    if (game.currentQuestionNumber >= game.options.questionsCount)
      return this.handleEndGameStage(game._id);

    await wait(answerTimeUpdate.options.timeForAnswerMs);

    const correctAnswersUpdate = await this.handleShowCorrectAnswersStage(
      answerTimeUpdate,
    );
    await wait(correctAnswersUpdate.options.timeForShowQuestionResult);

    const updatedGame = await this.handleNewQuestionStage(correctAnswersUpdate);
    await wait(updatedGame.options.timeForNextQuestionMs);

    return updatedGame;
  }

  private async handleNewQuestionStage(data: Pick<Game, '_id' | 'options'>) {
    const { _id, options } = data;
    const updatedGame = await this.update(_id, {
      canAnswer: true,
      currentTimer: {
        stage: 'NEW QUESTION',
        date: addSecondsToDate(options.timeForNextQuestionMs / 1000),
      },
    });
    this.eventsGateway.server.emit('updateGameStage', updatedGame);
    return updatedGame;
  }

  private async handleEndGameStage(gameId: string) {
    this.eventsGateway.server.emit(
      'endGame',
      await this.update(gameId, { isFinished: true }),
    );
  }

  private async handleQuestionLogicStage(
    data: Pick<Game, '_id' | 'currentQuestionNumber' | 'options'>,
  ) {
    const { _id, currentQuestionNumber, options } = data;
    const updatedGame = await this.update(_id, {
      currentQuestionNumber: currentQuestionNumber + 1,
      currentQuestion: temporaryQuestions[currentQuestionNumber],
      currentPlayersAnswers: new Map(),
      canAnswer: false,
      currentTimer: {
        stage: 'QUESTION',
        date: addSecondsToDate(options.timeForShowQuestionAnswersMs / 1000),
      },
    });
    this.eventsGateway.server.emit('showNewQuestionInGame', {
      data: updatedGame,
      questionText: updatedGame.currentQuestion.question,
    });

    await wait(updatedGame.options.timeForShowQuestionAnswersMs);

    return this.handleAnswerTimeStage(updatedGame);
  }

  private async handleAnswerTimeStage(data: Pick<Game, '_id' | 'options'>) {
    const { _id, options } = data;
    const updatedGameWithPossibleAnswers = await this.update(_id, {
      canAnswer: true,
      currentTimer: {
        stage: 'ANSWER TIME',
        date: addSecondsToDate(options.timeForAnswerMs / 1000),
      },
    });

    this.eventsGateway.server.emit(
      'showQuestionPossibleAnswers',
      updatedGameWithPossibleAnswers,
    );

    return updatedGameWithPossibleAnswers;
  }

  private async handleShowCorrectAnswersStage(
    data: Pick<Game, '_id' | 'options'>,
  ) {
    const { _id, options } = data;
    const gameWithShowAnswers = await this.update(_id, {
      canAnswer: false,
      currentTimer: {
        stage: 'QUESTION RESULT',
        date: addSecondsToDate(options.timeForShowQuestionResult / 1000),
      },
    });
    this.eventsGateway.server.emit(
      'showCurrentQuestionAnswersInGame',
      gameWithShowAnswers,
    );
    //TODO: scores
    // Emit here which question is correct add points etc

    return gameWithShowAnswers;
  }

  findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  findById(id: string, projection?: ProjectonType): Promise<Game> {
    return this.gameModel.findById(id, projection, {});
  }

  async findOne(filter: FilterQueryGameType): Promise<Game> {
    const foundGame = await this.gameModel
      .findOne(filter, {}, { populate: { path: 'room' } })
      .exec();
    if (!foundGame)
      throw new NotFoundException({
        message: `Game not found`,
      });

    return foundGame;
  }

  async update(id: string, updateData: UpdateGameDto): Promise<Game> {
    return this.gameModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async updateCurrentPlayerAnswer(
    id: string,
    playerId: string,
    answerId: string,
  ): Promise<Game> {
    const foundGame = await this.findById(id);
    //TODO: improve
    if (!foundGame.canAnswer) return foundGame;

    //TODO: improve
    if (foundGame.currentPlayersAnswers.has(playerId)) return foundGame;

    return await this.gameModel
      .findByIdAndUpdate(
        id,
        { $set: { [`currentPlayersAnswers.${playerId}`]: answerId } },
        { new: true },
      )
      .exec();
  }
}
