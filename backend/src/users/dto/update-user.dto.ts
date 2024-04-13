import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Room } from 'src/shared';
import { CurrentActionUser } from 'src/shared';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(CurrentActionUser)
  currentAction?: CurrentActionUser;

  @IsOptional()
  currentRoom?: Room;
}
