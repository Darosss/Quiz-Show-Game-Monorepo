import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ManageUserInRoom } from './enums';
import { ManagePlayerReadiness, Room, User } from 'src/shared';
import { Room as RoomSchema } from './schemas/room.schema';
type FilterAnswerType = FilterQuery<Room>;
type ProjectonType = ProjectionType<Room>;

const populate = [
  { path: 'players', select: { password: 0 } },
  { path: 'owner', select: { password: 0 } },
];

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(RoomSchema.name)
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
    const foundRoom = await this.roomModel
      .findOne(filter, projection, {
        populate,
      })
      .exec();

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
        populate,
      });

      if (!room) throw new NotFoundException('Room not found');

      return room;
    } catch (error) {
      console.error('Error managing user in room:', error);
    }
  }

  async changeRoomsOwner(roomId: string, newOwner: User) {
    Logger.log('change rooms owner', roomId, newOwner);
    return await this.roomModel.findByIdAndUpdate(roomId, {
      owner: newOwner,
    });
  }

  async manageUserReadiness(
    room: Room,
    userId: string,
    action: ManagePlayerReadiness,
  ) {
    try {
      const update: UpdateQuery<Room> = {};
      if (action === ManagePlayerReadiness.READY) {
        update.$push = { playersReadiness: userId };
      } else if (action === ManagePlayerReadiness.NOT_READY) {
        update.$pull = { playersReadiness: userId };
      }

      //Note: the reason why I add +1 is because its checking before update
      if (
        room.players.length === room.playersReadiness.length + 1 &&
        action === ManagePlayerReadiness.READY
      )
        update.$set = { canStart: true };
      else update.$set = { canStart: false };

      const updatedRoom = await this.roomModel.findByIdAndUpdate(
        room._id,
        update,
        { populate, new: true },
      );

      if (!updatedRoom) throw new NotFoundException('Room not found');

      return updatedRoom;
    } catch (error) {
      console.error('Error managing user readiness in room:', error);
    }
  }
}
