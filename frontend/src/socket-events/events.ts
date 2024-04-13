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
    userJoinLeave: {
      on: (cb) => socketConnection.on("userJoinLeave", (data) => cb(data)),
      off: () => socketConnection.off("userJoinLeave"),
    },

    userSetReady: {
      on: (cb) => socketConnection.on("userSetReady", (data) => cb(data)),
      off: () => socketConnection.off("userSetReady"),
    },
  };
};
