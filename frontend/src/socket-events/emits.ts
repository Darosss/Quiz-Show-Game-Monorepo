import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/shared/socket-events-types";
import { Socket } from "socket.io-client";
import { SocketContexType } from "./types";

export const getSocketEmitsFunctions = (
  socketConnection: Socket<ServerToClientEvents, ClientToServerEvents>
): SocketContexType["emits"] => {
  return {
    joinRoom: (code) => socketConnection.emit("joinRoom", code),
    leaveRoom: (code) => socketConnection.emit("leaveRoom", code),
    getGameSession: (room, cb) =>
      socketConnection.emit("getGameSession", room, (e) => {
        return cb(e);
      }),
    chooseAnswer: (data) => socketConnection.emit("chooseAnswer", data),
  };
};
