import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { OnlyIDParamDTO } from 'src/mongo';
import { RolesAdminSuperAdminGuard } from 'src/auth';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question, QuestionAnswerType } from 'src/shared';
import { ControllerResponseReturn } from 'src/types';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly categoryService: CategoriesService,
  ) {}

  @RolesAdminSuperAdminGuard()
  @Get()
  async findAll(): Promise<ControllerResponseReturn<Question[]>> {
    return {
      data: await this.questionsService.findAll(),
    };
  }

  @RolesAdminSuperAdminGuard()
  @Post('/create')
  async create(
    @Body() createData: CreateQuestionDto,
  ): Promise<ControllerResponseReturn<Question>> {
    const { categoryId, answers, ...rest } = createData;
    const category = await this.categoryService.findOne({ _id: categoryId });
    if (!category)
      throw new NotFoundException('Provided category does not exist');
    const answersForService: Pick<QuestionAnswerType, 'isCorrect' | 'name'>[] =
      answers.map((val) => {
        const namesMap: QuestionAnswerType['name'] = new Map(val.name);
        return { isCorrect: val.isCorrect, name: namesMap };
      });
    return {
      data: await this.questionsService.create({
        category,
        answers: answersForService,
        ...rest,
      }),
      message: 'Successfully created quesiton',
    };
  }

  @RolesAdminSuperAdminGuard()
  @Get(':id')
  async findOne(
    @Param() { id }: OnlyIDParamDTO,
  ): Promise<ControllerResponseReturn<Question>> {
    return {
      data: await this.questionsService.findOne({ _id: id }),
    };
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  async update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() udpateData: UpdateQuestionDto,
  ): Promise<ControllerResponseReturn<Question>> {
    const { categoryId, answers, ...rest } = udpateData;
    const category = categoryId
      ? await this.categoryService.findOne({ _id: categoryId })
      : undefined;
    const answersForService: Pick<QuestionAnswerType, 'isCorrect' | 'name'>[] =
      answers.map((val) => {
        const namesMap: QuestionAnswerType['name'] = new Map(val.name);
        return { isCorrect: val.isCorrect, name: namesMap };
      });
    return {
      data: await this.questionsService.update(id, {
        category,
        answers: answersForService,
        ...rest,
      }),
      message: 'Successfully updated the question',
    };
  }
  @RolesAdminSuperAdminGuard()
  @Delete(':id')
  async remove(
    @Param() { id }: OnlyIDParamDTO,
  ): Promise<ControllerResponseReturn<boolean>> {
    await this.questionsService.remove(id);

    return {
      data: true,
      message: 'Successfully removed the question',
    };
  }
}
