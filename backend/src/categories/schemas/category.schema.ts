import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { Category as CategoryType } from 'src/shared';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category implements CategoryType {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
