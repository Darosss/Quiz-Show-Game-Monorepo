import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/shared';
import { ControllerResponseReturn } from 'src/types';
import { RolesAdminSuperAdminGuard } from 'src/auth';
import { OnlyIDParamDTO } from 'src/mongo';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @RolesAdminSuperAdminGuard()
  @Post('/create')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ControllerResponseReturn<Category>> {
    const { name, ...rest } = createCategoryDto;
    const namesForService = new Map(name);
    return {
      data: await this.categoriesService.create({
        name: namesForService,
        ...rest,
      }),
      message: 'Successfully created category',
    };
  }

  @Get()
  async findAll(): Promise<ControllerResponseReturn<Category[]>> {
    return { data: await this.categoriesService.findAll() };
  }

  @Get(':id')
  async findOne(
    @Param() { id }: OnlyIDParamDTO,
  ): Promise<ControllerResponseReturn<Category>> {
    return { data: await this.categoriesService.findOne({ _id: id }) };
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  async update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ControllerResponseReturn<Category>> {
    const { name, ...rest } = updateCategoryDto;
    const namesForService = new Map(name);
    return {
      data: await this.categoriesService.update(id, {
        name: namesForService,
        ...rest,
      }),
      message: 'Successfully updated category',
    };
  }

  @RolesAdminSuperAdminGuard()
  @Delete(':id')
  async remove(
    @Param() { id }: OnlyIDParamDTO,
  ): Promise<ControllerResponseReturn<Category>> {
    return {
      data: await this.categoriesService.remove(id),
      message: 'Successfully removed category',
    };
  }
}
