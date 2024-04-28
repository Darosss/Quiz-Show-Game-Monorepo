import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { UsersModule } from 'src/users';
import { GamesGateway } from './games.gateway';
import { EventsGateway } from 'src/events';
import { GamesSessionsService } from './games-sessions.service';
import { RoomsModule } from 'src/rooms';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UsersModule,
    forwardRef(() => RoomsModule),
    QuestionsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesSessionsService, GamesGateway, EventsGateway],
  exports: [GamesService, GamesSessionsService],
})
export class GamesModule {}
