import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { Game } from 'src/shared';
import { User } from 'src/users';
import { RoomOptions } from './room-options.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  players: User[];

  @Prop()
  playersReadiness: string[];

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  code: string;

  @Prop({ type: Boolean, default: false })
  canStart: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  game: Game | null;

  @Prop({ type: RoomOptions, default: new RoomOptions() })
  options: RoomOptions;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
