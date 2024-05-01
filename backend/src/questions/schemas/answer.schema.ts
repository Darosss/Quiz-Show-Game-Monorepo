import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PossibleLanguages, QuestionAnswerType } from 'src/shared';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ _id: false })
export class Answer implements QuestionAnswerType {
  @Prop({ required: false })
  isCorrect?: boolean;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: Map })
  name: Map<PossibleLanguages, string>;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
