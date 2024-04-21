import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { UsersModule } from 'src/users';
import { GamesGateway } from './games.gateway';
import { EventsGateway } from 'src/events';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UsersModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway, EventsGateway],
  exports: [GamesService],
})
export class GamesModule {}
