import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketEventsSubscribeMessage } from 'src/events/events.gateway';

import {
  ServerToClientEvents,
  ClientToServerEvents,
  Game,
  Room,
  ChooseAnswerData,
} from 'src/shared';
import { GamesService } from './games.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_FRONTEND_ORIGIN,
  },
})
export class GamesGateway {
  constructor(private readonly gameService: GamesService) {}
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  @SocketEventsSubscribeMessage('getGameSession')
  async onGetGameSession(@MessageBody() room: Room): Promise<Game> {
    if (!room.game) return null;
    return await this.gameService.findById(room.game._id);
  }

  @SocketEventsSubscribeMessage('chooseAnswer')
  async onChooseAnswer(
    @MessageBody() { gameId, answerId, playerId }: ChooseAnswerData,
  ): Promise<void> {
    const game = await this.gameService.updateCurrentPlayerAnswer(
      gameId,
      playerId,
      answerId,
    );
    //Do not emit where no game found === no game found === can't choose answer
    if (!game) return;

    this.server.emit('userChoseAnswer', {
      userAnswer: {
        [`${playerId}`]: game.playersData.get(playerId) || {
          score: 0,
          currentAnswer: answerId,
        },
      },
    });
  }
}
