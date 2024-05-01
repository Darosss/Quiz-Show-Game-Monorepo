import { IsArray, IsInstance, IsString } from 'class-validator';
import { Category as CategorySchema } from 'src/categories/schemas/category.schema';
import { Category, PossibleLanguages, QuestionAnswerType } from 'src/shared';

export class CreateQuestionDto {
  question: Map<PossibleLanguages, string>;

  @IsArray()
  answers: {
    isCorrect: QuestionAnswerType['isCorrect'];
    name: [[PossibleLanguages, string]];
  }[];

  @IsString()
  categoryId: string;
}

export class CreateQuestionDtoService {
  question: Map<PossibleLanguages, string>;

  @IsArray()
  answers: Pick<QuestionAnswerType, 'isCorrect' | 'name'>[];

  @IsInstance(CategorySchema)
  category: Category;
}
