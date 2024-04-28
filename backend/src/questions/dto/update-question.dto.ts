import { PartialType } from '@nestjs/swagger';
import {
  CreateQuestionDto,
  CreateQuestionDtoService,
} from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

export class UpdateQuestionServiceDto extends PartialType(
  CreateQuestionDtoService,
) {}
