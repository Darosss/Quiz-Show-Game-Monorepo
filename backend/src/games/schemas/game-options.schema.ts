import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameOptions as GameOptionsType } from 'src/shared';

export type GameOptionsDocument = HydratedDocument<GameOptions>;

@Schema({ _id: false })
export class GameOptions implements GameOptionsType {
  @Prop({ default: 5 })
  questionsCount: number;

  @Prop({ default: 10000 })
  timeForAnswerMs: number;

  @Prop({ default: 4000 })
  timeForNextQuestionMs: number;

  @Prop({ default: 5000 })
  timeForShowQuestionResult: number;

  @Prop({ default: 8000 })
  timeForShowQuestionAnswersMs: number;

  @Prop({ default: 100 })
  pointsPerCorrect: number;

  @Prop({ default: -100 })
  pointsPerWrong: number;
}
