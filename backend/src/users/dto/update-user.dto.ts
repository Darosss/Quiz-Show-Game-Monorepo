import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { Room } from 'src/shared';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  currentRoom?: Room;
}
