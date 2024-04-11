import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { SafeMongoIdTransform } from './utils';
import { ApiProperty } from '@nestjs/swagger';

export class OnlyIDParamDTO {
  @ApiProperty({
    description: 'Id',
    required: true,
    type: String,
  })
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: string;
}
