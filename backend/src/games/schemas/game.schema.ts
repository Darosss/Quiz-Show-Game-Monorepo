import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import {
  Room,
  Game as GameType,
  CurrentQuestionType,
  GameOptions,
  CurrentTimerGame,
} from 'src/shared';

export type GameDocument = HydratedDocument<Game>;

//TODO: in all schemas change type: Object to schemas?

@Schema({ timestamps: true })
export class Game implements GameType {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  //TODO: this should be Question from db
  @Prop({ type: Object })
  currentQuestion: CurrentQuestionType | null;

  //TODO: this should be Category from db
  @Prop()
  currentCategory: string | null;

  @Prop({
    type: Object,
    default: {
      questionsCount: 5,
      timeForAnswerMs: 10000,
      timeForNextQuestionMs: 4000,
      timeForShowQuestionResult: 5000,
      timeForShowQuestionAnswersMs: 8000,
    },
  })
  options: GameOptions;

  @Prop()
  canAnswer: boolean;

  @Prop({ default: false })
  isFinished: boolean;

  @Prop({ type: Object })
  currentTimer: CurrentTimerGame | null;

  @Prop({ default: 0 })
  currentQuestionNumber: number;

  //TODO: change this to schmea like:
  // - playerId
  // - answer
  // - points

  @Prop({ default: new Map() })
  currentPlayersAnswers: Map<string, string>;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
