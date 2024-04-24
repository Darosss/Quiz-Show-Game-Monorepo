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
    startGame: {
      on: (cb) => socketConnection.on("startGame", () => cb()),
      off: () => socketConnection.off("startGame"),
    },
    userJoinLeave: {
      on: (cb) => socketConnection.on("userJoinLeave", (data) => cb(data)),
      off: () => socketConnection.off("userJoinLeave"),
    },

    userSetReady: {
      on: (cb) => socketConnection.on("userSetReady", (data) => cb(data)),
      off: () => socketConnection.off("userSetReady"),
    },
    userChoseAnswer: {
      on: (cb) =>
        socketConnection.on("userChoseAnswer", (currentPlayersAnswers) =>
          cb(currentPlayersAnswers)
        ),
      off: () => socketConnection.off("userChoseAnswer"),
    },
    showNewQuestionInGame: {
      on: (cb) =>
        socketConnection.on("showNewQuestionInGame", (data) => cb(data)),
      off: () => socketConnection.off("showNewQuestionInGame"),
    },
    showQuestionPossibleAnswers: {
      on: (cb) =>
        socketConnection.on("showQuestionPossibleAnswers", (data) => cb(data)),
      off: () => socketConnection.off("showQuestionPossibleAnswers"),
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
    updateGameStage: {
      on: (cb) => socketConnection.on("updateGameStage", (data) => cb(data)),
      off: () => socketConnection.off("updateGameStage"),
    },
  };
};
