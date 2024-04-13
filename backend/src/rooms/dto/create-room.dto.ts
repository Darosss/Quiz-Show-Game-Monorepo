import { IsInstance, IsOptional, IsString } from 'class-validator';
import { User } from 'src/shared';
import { User as UserSchema } from 'src/users';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsInstance(UserSchema)
  owner: User;

  @IsString()
  code: string;

  @IsOptional()
  players: User[];
}
