import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrentTimerGame, Room } from 'src/shared';

export class CreateGameDto {
  @IsString()
  room: Room;

  @IsNumber()
  questionsCount: number;

  @IsOptional()
  currentTimer: CurrentTimerGame;
}
