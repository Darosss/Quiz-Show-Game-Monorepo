import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { OnlyIDParamDTO } from 'src/mongo';
import { RolesAdminSuperAdminGuard } from 'src/auth';
import { UsersService } from 'src/users';
import { ControllerResponseReturn } from 'src/types';
import { Game } from 'src/shared';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
  ) {}

  // @Post('start-a-game')
  // async create(@Body() { name }: Pick<CreateGameDto, 'name'>, @Request() req) {
  //   const user = await this.usersService.findOne({ _id: req.user.sub });
  //   return this.gamesService.create({ name, code: '123', owner: user });
  // }
  @Get('current-game-session')
  async getCurrentGameSession(
    @Request() req,
  ): Promise<ControllerResponseReturn<Game | null>> {
    const user = await this.usersService.findOne({ _id: req.user.sub });

    try {
      const game = await this.gamesService.findOne({
        room: { _id: user.currentRoom._id },
      });

      return {
        data: game,
        message: '',
      };
    } catch {
      return { data: null, message: 'Game session not found' };
    }
  }
}
