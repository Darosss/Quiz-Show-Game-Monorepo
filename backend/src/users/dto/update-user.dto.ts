import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum } from 'class-validator';
import { Room } from 'src/rooms/schemas/room.schema';
import { CurrentActionUser } from 'src/shared';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(CurrentActionUser)
  currentAction: CurrentActionUser;

  currentRoom: Room;
}
