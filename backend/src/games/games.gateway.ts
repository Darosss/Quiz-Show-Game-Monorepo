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

@WebSocketGateway({ cors: { origin: '*' } })
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

    this.server.emit('userChoseAnswer', game.currentPlayersAnswers);
  }
}
