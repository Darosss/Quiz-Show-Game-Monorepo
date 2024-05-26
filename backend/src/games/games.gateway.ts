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
  ChooseCategoryData,
} from 'src/shared';
import { GamesService } from './games.service';
import { CategoriesService } from 'src/categories/categories.service';
import { GamesSessionsService } from './games-sessions.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway {
  constructor(
    private readonly gameService: GamesService,
    private readonly gameSessionService: GamesSessionsService,
    private readonly categoryService: CategoriesService,
  ) {}
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
  @SocketEventsSubscribeMessage('chooseCategory')
  async onChooseCategory(
    @MessageBody()
    { gameId, categoryId, playerId }: ChooseCategoryData,
  ): Promise<void> {
    const foundGame = await this.gameService.findById(gameId);

    if (!foundGame.playersData.get(playerId).canChooseCategory) {
      return;
    }

    const chosenCategory = await this.categoryService.findOne({
      _id: categoryId,
    });

    await this.gameSessionService.userOnChooseCategorySubscribedMessage(
      foundGame,
      chosenCategory,
      playerId,
    );
  }
}
