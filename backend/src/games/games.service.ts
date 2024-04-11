import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

type FilterAnswerType = FilterQuery<Game>;
type ProjectonType = ProjectionType<Game>;

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<Game>,
  ) {}

  findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  findById(id: string, projection?: ProjectonType): Promise<Game> {
    return this.gameModel.findOne({ question: id }, projection);
  }
}
