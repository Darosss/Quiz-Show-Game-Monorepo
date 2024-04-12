import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//TODO: make paths aliases
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../../shared/socket-events-types';

const SocketEventsSubscribeMessage = SubscribeMessage<
  keyof ClientToServerEvents
>;
const SocketEmitsSubscribeMessage = SubscribeMessage<
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
