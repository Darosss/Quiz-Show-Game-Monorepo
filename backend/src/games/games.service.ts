import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

type FilterQueryGameType = FilterQuery<Game>;
type ProjectonType = ProjectionType<Game>;

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
  ) {}

  async create(data: CreateGameDto): Promise<Game> {
    const createdRoom = new this.gameModel(data);
    return createdRoom.save();
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
  ): Promise<Game | void> {
    const foundGame = await this.findById(id);
    //TODO: improve
    if (!foundGame.canAnswer) {
      return;
    }
    //TODO: improve
    if (foundGame.playersData.get(playerId).currentAnswer) {
      return;
    }

    return await this.gameModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            [`playersData.${playerId}`]: {
              score: foundGame.playersData.get(playerId).score || 0,
              currentAnswer: answerId,
            },
          },
        },
        { new: true },
      )
      .exec();
  }
}
