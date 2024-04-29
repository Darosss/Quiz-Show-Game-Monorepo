import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { Room, Game as GameType, Question, Category } from 'src/shared';
import { GameOptions } from './game-options.schema';
import { CurrentTimer } from './current-timer.schema';
import { PlayerData } from './player-data.schema';
import { Question as QuestionSchema } from 'src/questions/schemas/question.schema';
import { Category as CategorySchema } from 'src/categories/schemas/category.schema';

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Game implements GameType {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  @Prop({ type: QuestionSchema })
  currentQuestion: Question | null;

  @Prop({ type: CategorySchema })
  currentCategory: Category | null;

  @Prop({
    type: GameOptions,
    default: new GameOptions(),
  })
  options: GameOptions;

  @Prop()
  canAnswer: boolean;

  @Prop({ default: false })
  isFinished: boolean;

  @Prop({ type: CurrentTimer })
  currentTimer: CurrentTimer | null;

  @Prop({ default: 0 })
  currentQuestionNumber: number;

  @Prop({ type: Map<string, PlayerData>, default: new Map() })
  playersData: Map<string, PlayerData>;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
