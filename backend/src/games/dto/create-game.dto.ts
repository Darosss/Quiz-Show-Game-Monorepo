import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrentTimerGame, Game, Room } from 'src/shared';
import { PlayerData } from '../schemas/player-data.schema';

export class CreateGameDto {
  @IsString()
  room: Room;

  @IsNumber()
  questionsCount: number;

  @IsOptional()
  currentTimer?: CurrentTimerGame;

  @IsOptional()
  playersData?: Game['playersData'];
}
