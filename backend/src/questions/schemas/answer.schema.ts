import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuestionAnswerType } from 'src/shared';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ _id: false })
export class Answer implements QuestionAnswerType {
  @Prop({ required: false })
  isCorrect?: boolean;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
