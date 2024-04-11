import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashString } from 'src/auth/auth.helpers';
import { Room } from 'src/rooms/schemas/room.schema';
import { CurrentActionUser } from 'src/shared';

type FilterQueryUserType = FilterQuery<User>;
type ProjectionUserType = ProjectionType<User>;
type QueryOptionsUserType = QueryOptions<User>;
type PopulateUserType = QueryOptionsUserType['populate'];
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async create({ password, ...rest }: CreateUserDto) {
    const hashedPassword = await hashString(password);
    const createdCategory = new this.userModel({
      password: hashedPassword,
      ...rest,
    });
    return createdCategory.save();
  }

  findAll(
    filter?: FilterQueryUserType,
    projection: ProjectionUserType = { password: false },
  ) {
    return this.userModel.find(filter, projection).exec();
  }

  async findOne(
    filter: FilterQueryUserType,
    projection: ProjectionUserType = { password: false },
    populate?: PopulateUserType,
  ): Promise<User> {
    const foundUser = await this.userModel
      .findOne(filter, projection, { populate })
      .exec();
    if (!foundUser)
      throw new NotFoundException({
        message: `User not found`,
      });

    return foundUser;
  }

  update(filter: FilterQueryUserType, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(filter, updateUserDto, {
      new: true,
    });
  }

  remove(filter: FilterQueryUserType) {
    return this.userModel.findByIdAndDelete(filter);
  }

  changeUserCurrentRoom(userId: string, room: Room) {
    return this.update(
      { _id: userId },
      { currentAction: CurrentActionUser.IN_ROOM, currentRoom: room },
    );
  }
  removeUserCurrentRoom(userId: string) {
    return this.update(
      { _id: userId },
      { currentAction: CurrentActionUser.IDLE, currentRoom: null },
    );
  }
}
