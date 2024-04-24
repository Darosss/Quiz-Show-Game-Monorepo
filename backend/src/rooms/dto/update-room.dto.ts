import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsOptional } from 'class-validator';
import { Game } from 'src/shared';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  canStart?: boolean;

  @IsOptional()
  game?: Game;

  @IsOptional()
  playersReadiness?: string[];
}
