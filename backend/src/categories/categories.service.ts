import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/shared';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Category as CategorySchema } from './schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';

type FilterQuestionType = FilterQuery<Category>;
type ProjectonType = ProjectionType<Category>;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategorySchema.name)
    private categoryModel: Model<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);

    return createdCategory.save();
  }

  findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(
    filter: FilterQuestionType,
    projection?: ProjectonType,
  ): Promise<Category> {
    const foundQuestion = await this.categoryModel
      .findOne(filter, projection)
      .exec();

    if (!foundQuestion)
      throw new NotFoundException({
        message: `Question not found`,
      });

    return foundQuestion;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
