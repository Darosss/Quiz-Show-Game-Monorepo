import { IsNumber, IsOptional, IsString } from 'class-validator';
import { GameOptions, Room } from 'src/shared';

export class CreateGameSessionDto {
  @IsString()
  room: Room;

  @IsOptional()
  options?: Partial<GameOptions>;

  @IsNumber()
  @IsOptional()
  gameStartInMs?: number;
}
