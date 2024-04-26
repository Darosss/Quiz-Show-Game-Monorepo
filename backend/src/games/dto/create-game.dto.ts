import { IsOptional, IsString } from 'class-validator';
import { CurrentTimerGame, Game, Room } from 'src/shared';

export class CreateGameDto {
  @IsString()
  room: Room;

  @IsOptional()
  currentTimer?: CurrentTimerGame;

  @IsOptional()
  playersData?: Game['playersData'];
}
