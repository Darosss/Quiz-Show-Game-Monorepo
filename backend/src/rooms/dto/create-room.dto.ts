import { IsInstance, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsInstance(User)
  owner: User;

  @IsString()
  code: string;

  @IsOptional()
  players: User[];
}
