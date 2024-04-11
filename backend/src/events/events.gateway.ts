import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

//TODO: make paths aliases
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../../shared/socket-events-types';
import { User } from 'src/users';

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
  onJoinRoom(@MessageBody() data: unknown): Promise<void> {
    return;
  }

  @SocketEventsSubscribeMessage('leaveRoom')
  async onLeaveRoom(@MessageBody() data: number): Promise<number> {
    return data;
  }

  emitJoinUser(user: User) {
    return this.server.emit('userJoinedRoom', user);
  }
}
