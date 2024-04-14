import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ServerToClientEvents, ClientToServerEvents } from 'src/shared';

export const SocketEventsSubscribeMessage = SubscribeMessage<
  keyof ClientToServerEvents
>;

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  @SocketEventsSubscribeMessage('joinRoom')
  onJoinRoom(
    @MessageBody() code,
    @ConnectedSocket() client: Socket,
  ): Promise<void> | void {
    return client.join(code);
  }

  @SocketEventsSubscribeMessage('leaveRoom')
  async onLeaveRoom(
    @MessageBody() code,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    return client.leave(code);
  }
}
