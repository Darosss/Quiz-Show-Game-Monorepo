import { IsArray, IsInstance, IsString } from 'class-validator';
import { Category as CategorySchema } from 'src/categories/schemas/category.schema';
import { Category, QuestionAnswerType } from 'src/shared';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  answers: Pick<QuestionAnswerType, 'isCorrect' | 'name'>[];

  @IsString()
  categoryId: string;
}

export class CreateQuestionDtoService {
  @IsString()
  question: string;

  @IsArray()
  answers: Pick<QuestionAnswerType, 'isCorrect' | 'name'>[];

  @IsInstance(CategorySchema)
  category: Category;
}
