import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Room } from 'src/shared';

export class CreateGameSessionDto {
  @IsString()
  room: Room;

  @IsNumber()
  questionsCount: number;

  @IsNumber()
  @IsOptional()
  gameStartInMs?: number;
}
