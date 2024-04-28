import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Question, QuestionAnswerType } from 'src/shared';
import { CreateQuestionDtoService } from './dto/create-question.dto';
import { UpdateQuestionServiceDto } from './dto/update-question.dto';
import { Question as QuestionSchema } from './schemas/question.schema';

type FilterQuestionType = FilterQuery<Question>;
type ProjectonType = ProjectionType<Question>;

const populate = { path: 'category' };

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(QuestionSchema.name)
    private questionModel: Model<Question>,
  ) {}

  async create(createData: CreateQuestionDtoService): Promise<Question> {
    const { answers, ...rest } = createData;
    const answersWithIDs = answers.map<QuestionAnswerType>(
      ({ isCorrect, name }, index) => ({
        isCorrect,
        name,
        id: `${index}`,
      }),
    );

    const createdQuestion = new this.questionModel({
      answers: answersWithIDs,
      ...rest,
    });
    return createdQuestion.save();
  }

  findAll(filter?: FilterQuestionType): Promise<Question[]> {
    return this.questionModel.find(filter, {}, { populate }).exec();
  }

  async findOne(
    filter: FilterQuestionType,
    projection?: ProjectonType,
  ): Promise<Question> {
    const foundQuestion = await this.questionModel
      .findOne(filter, projection)
      .exec();

    if (!foundQuestion)
      throw new NotFoundException({
        message: `Question not found`,
      });

    return foundQuestion;
  }

  findById(id: string, projection?: ProjectonType): Promise<Question> {
    return this.questionModel.findOne({ question: id }, projection);
  }

  async update(
    id: string,
    updateData: UpdateQuestionServiceDto,
  ): Promise<Question> {
    const { answers, ...rest } = updateData;

    const answersWithIDs = answers
      ? answers.map<QuestionAnswerType>(({ isCorrect, name }, index) => ({
          isCorrect,
          name,
          id: `${index}`,
        }))
      : undefined;

    return this.questionModel
      .findByIdAndUpdate(
        id,
        {
          ...rest,
          ...(answersWithIDs.length > 0 && { answers: answersWithIDs }),
        },
        { new: true },
      )
      .exec();
  }

  remove(id: string) {
    return this.questionModel.findByIdAndDelete(id);
  }

  async getRandomQuestion(): Promise<Question | undefined> {
    const randomQuestion = await this.questionModel.aggregate<
      Question | undefined
    >([{ $sample: { size: 1 } }]);

    return randomQuestion.at(0);
  }
}
