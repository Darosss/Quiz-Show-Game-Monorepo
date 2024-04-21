import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { UsersModule } from 'src/users';
import { EventsGateway } from 'src/events/events.gateway';
import { GamesModule } from 'src/games';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    UsersModule,
    GamesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, EventsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}
