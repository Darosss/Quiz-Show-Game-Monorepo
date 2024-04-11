import { IsInstance, IsString } from 'class-validator';
import { User } from 'src/users';

export class CreateGameDto {
  @IsString()
  name: string;

  @IsInstance(User)
  owner: User;

  @IsString()
  code: string;
}
