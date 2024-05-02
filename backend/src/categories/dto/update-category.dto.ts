import { PartialType } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  CreateCategoryServiceDto,
} from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryServiceDto extends PartialType(
  CreateCategoryServiceDto,
) {}
