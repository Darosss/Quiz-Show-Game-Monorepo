import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { Question, Game, Category } from 'src/shared';
import { IsOptional } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsOptional()
  currentQuestion?: Question;

  @IsOptional()
  currentCategory?: Category;

  @IsOptional()
  currentQuestionNumber?: number;

  @IsOptional()
  canAnswer?: Game['canAnswer'];

  @IsOptional()
  currentTimer?: Game['currentTimer'];

  @IsOptional()
  isFinished?: Game['isFinished'];

  @IsOptional()
  playersData?: Game['playersData'];
}
