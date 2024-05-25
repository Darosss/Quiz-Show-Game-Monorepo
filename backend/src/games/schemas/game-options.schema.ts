import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameOptions as GameOptionsType, PossibleLanguages } from 'src/shared';

export type GameOptionsDocument = HydratedDocument<GameOptions>;

@Schema({ _id: false })
export class GameOptions implements GameOptionsType {
  @Prop({ default: 5 })
  questionsCount: number;

  @Prop({ default: 10000 })
  answerTimeMs: number;

  @Prop({ default: 4000 })
  nextQuestionMs: number;

  @Prop({ default: 5000 })
  showQuestionResultMs: number;

  @Prop({ default: 8000 })
  showQuestionAnswersMs: number;

  @Prop({ default: 4000 })
  startGameMs: number;

  @Prop({ default: 5000 })
  endGameMs: number;

  @Prop({ default: 100 })
  pointsPerCorrect: number;

  @Prop({ default: -100 })
  pointsPerWrong: number;

  @Prop({ enum: PossibleLanguages, default: PossibleLanguages.EN })
  language: PossibleLanguages;
}
