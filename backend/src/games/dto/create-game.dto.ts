import { IsNumber, IsString } from 'class-validator';
import { Room } from 'src/shared';

export class CreateGameDto {
  @IsString()
  room: Room;

  @IsNumber()
  questionsCount: number;
}
