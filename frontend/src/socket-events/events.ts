import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/shared/socket-events-types";
import { Socket } from "socket.io-client";
import { SocketContexType } from "./types";

export const getSocketEventsFunctions = (
  socketConnection: Socket<ServerToClientEvents, ClientToServerEvents>
): SocketContexType["events"] => {
  return {
    userJoinedRoom: {
      on: (cb) => socketConnection.on("userJoinedRoom", (user) => cb(user)),
      off: () => socketConnection.off("userJoinedRoom"),
    },

    userLeftRoom: {
      on: (cb) => socketConnection.on("userLeftRoom", (userId) => cb(userId)),
      off: () => socketConnection.off("userLeftRoom"),
    },
  };
};
