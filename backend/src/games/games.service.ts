import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';

import { CurrentQuestionType, addSecondsToDate } from 'src/shared';

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

  async create(data: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel({
      ...data,
      currentTimer: {
        stage: 'GAME STARTING',
        date: addSecondsToDate(5),
      },
    });

    const game = await createdGame.save();
    this.ongoingGamesTimers.set(createdGame._id, await this.gameTimeout(game));
    return game;
  }

  async gameTimeout(game: Game) {
    return setTimeout(async () => {
      const updatedGame = await this.update(game._id, {
        currentQuestionNumber: game.currentQuestionNumber + 1,
        currentQuestion: temporaryQuestions[game.currentQuestionNumber],
        currentPlayersAnswers: new Map(),
        canAnswer: true,
        currentTimer: {
          stage: 'ANSWER TIME',
          date: addSecondsToDate(game.options.timeForAnswerMs / 1000),
        },
      });
      console.log(
        'Current question!',
        updatedGame.currentQuestionNumber,
        updatedGame.currentQuestion.question,
      );
      this.eventsGateway.server.emit('newQuestionInGame', updatedGame);
      if (game.currentQuestionNumber >= game.options.questionsCount) {
        this.eventsGateway.server.emit(
          'endGame',
          await this.update(updatedGame._id, { isFinished: true }),
        );
        return;
      }
      const timeForAnswer = updatedGame.options.timeForAnswerMs;
      console.log(`"timeForAnswer:", ${timeForAnswer}`);
      console.log(
        `"timeForNextQuestion:", ${game.options.timeForNextQuestionMs}`,
      );

      setTimeout(async () => {
        console.log('Show answers!!!', updatedGame.currentQuestion.answers);
        const gameWithShowAnswers = await this.update(updatedGame._id, {
          canAnswer: false,
          currentTimer: {
            stage: 'WAIT FOR NEW QUESTION',
            date: addSecondsToDate(game.options.timeForNextQuestionMs / 1000),
          },
        });
        this.eventsGateway.server.emit(
          'showCurrentQuestionAnswersInGame',
          gameWithShowAnswers,
        );

        // Emit here which question is correct add points etc
        await this.gameTimeout(updatedGame);
      }, timeForAnswer);
    }, game.options.timeForNextQuestionMs);
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
