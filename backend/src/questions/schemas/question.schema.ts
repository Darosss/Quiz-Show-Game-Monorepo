import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import {
  Category,
  PossibleLanguages,
  Question as QuestionType,
} from 'src/shared';
import { Answer } from './answer.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question implements QuestionType {
  _id: string;

  @Prop({ required: true })
  possibleLanguages: PossibleLanguages[];

  @Prop({ required: true, type: Map })
  question: Map<PossibleLanguages, string>;

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
