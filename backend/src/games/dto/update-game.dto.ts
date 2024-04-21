import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { CurrentQuestionType, Game } from 'src/shared';
import { IsOptional } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsOptional()
  currentQuestion?: CurrentQuestionType;

  @IsOptional()
  currentQuestionNumber?: number;

  @IsOptional()
  currentPlayersAnswers?: Game['currentPlayersAnswers'];

  @IsOptional()
  canAnswer?: Game['canAnswer'];

  @IsOptional()
  currentTimer?: Game['currentTimer'];

  @IsOptional()
  isFinished?: Game['isFinished'];
}
