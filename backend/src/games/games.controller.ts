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
}
