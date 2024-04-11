import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/shared/socket-events-types";

export type SocketContexType = {
  emits: ClientToServerEvents;
  events: SocketContextEvents;
};

type SocketContextEvents = {
  [K in keyof ServerToClientEvents]: EventHandler<ServerToClientEvents[K]>;
};

type EventHandler<T> = {
  on: (cb: T) => void;
  off: () => void;
};
