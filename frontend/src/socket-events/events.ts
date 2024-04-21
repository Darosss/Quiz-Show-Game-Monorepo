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
    startGame: {
      on: (cb) => socketConnection.on("startGame", () => cb()),
      off: () => socketConnection.off("startGame"),
    },
    userChoseAnswer: {
      on: (cb) =>
        socketConnection.on("userChoseAnswer", (currentPlayersAnswers) =>
          cb(currentPlayersAnswers)
        ),
      off: () => socketConnection.off("userChoseAnswer"),
    },
    newQuestionInGame: {
      on: (cb) => socketConnection.on("newQuestionInGame", (data) => cb(data)),
      off: () => socketConnection.off("newQuestionInGame"),
    },
    showCurrentQuestionAnswersInGame: {
      on: (cb) =>
        socketConnection.on("showCurrentQuestionAnswersInGame", (data) =>
          cb(data)
        ),
      off: () => socketConnection.off("showCurrentQuestionAnswersInGame"),
    },
    endGame: {
      on: (cb) => socketConnection.on("endGame", (data) => cb(data)),
      off: () => socketConnection.off("endGame"),
    },
  };
};
