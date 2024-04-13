import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import {
  RolesUser,
  CurrentActionUser,
  User as UserType,
  Room,
} from 'src/shared';

export type QuizCategoryDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User implements UserType {
  _id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: RolesUser.User })
  roles: RolesUser[];

  @Prop({
    type: String,
    enum: CurrentActionUser,
    default: CurrentActionUser.IDLE,
  })
  currentAction: CurrentActionUser;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  currentRoom?: Room;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
