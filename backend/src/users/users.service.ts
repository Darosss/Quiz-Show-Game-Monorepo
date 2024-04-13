import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashString } from 'src/auth/auth.helpers';
import { Room, User } from 'src/shared';
import { CurrentActionUser } from 'src/shared';
import { User as UserSchema } from './schemas/user.schema';

type FilterQueryUserType = FilterQuery<User>;
type ProjectionUserType = ProjectionType<User>;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name)
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
  ): Promise<User> {
    const foundUser = await this.userModel
      .findOne(filter, projection, {
        populate: {
          path: 'currentRoom',
          populate: [
            { path: 'players', select: { password: 0 } },
            { path: 'owner', select: { password: 0 } },
          ],
        },
      })
      .exec();
    if (!foundUser)
      throw new NotFoundException({
        message: `User not found`,
      });

    return foundUser;
  }

  update(
    filter: FilterQueryUserType,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
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
