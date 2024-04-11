import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ManageUserInRoom } from './enums';

type FilterAnswerType = FilterQuery<Room>;
type ProjectonType = ProjectionType<Room>;

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {}

  async create(data: CreateRoomDto): Promise<Room> {
    const createdAnswer = new this.roomModel(data);
    return createdAnswer.save();
  }

  findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async findOne(
    filter: FilterAnswerType,
    projection?: ProjectonType,
  ): Promise<Room> {
    const foundRoom = await this.roomModel.findOne(filter, projection).exec();

    if (!foundRoom)
      throw new NotFoundException({
        message: `Room not found`,
      });

    return foundRoom;
  }

  findById(id: string, projection?: ProjectonType): Promise<Room> {
    return this.roomModel.findOne({ question: id }, projection);
  }

  async update(id: string, updateData: UpdateRoomDto): Promise<Room> {
    return this.roomModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.roomModel.findByIdAndDelete(id);
  }

  async manageUserInRoom(
    roomId: string,
    userId: string,
    action: ManageUserInRoom,
  ): Promise<Room> {
    try {
      const update: UpdateQuery<Room> = {};

      if (action === ManageUserInRoom.ADD) {
        update.$push = { players: userId };
      } else if (action === ManageUserInRoom.REMOVE) {
        update.$pull = { players: userId };
      }

      const room = await this.roomModel.findByIdAndUpdate(roomId, update, {
        new: true,
      });

      if (!room) throw new NotFoundException('Room not found');

      return room;
    } catch (error) {
      console.error('Error managing user in room:', error);
    }
  }
}
