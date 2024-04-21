import { ManagePlayerReadiness, ManagePlayersInRoom } from "./enums";
import { Game, Room, User } from "./types";

//TODO: data in newQuestionInGame should hide isCorrect in currentQuestion and
// answered in currentPlayersAnswers from other players

export type ServerToClientEvents = {
  userJoinLeave: (data: UserJoinLeaveData) => void;
  userSetReady: (data: UserSetReadyData) => void;
  startGame: () => void;
  userChoseAnswer: (
    currentPlayersAnswers: Game["currentPlayersAnswers"]
  ) => void;

  newQuestionInGame: (
    data: Pick<
      Game,
      "currentQuestion" | "canAnswer" | "currentPlayersAnswers" | "currentTimer"
    >
  ) => void;

  showCurrentQuestionAnswersInGame: (
    data: Pick<Game, "currentQuestion" | "currentTimer">
  ) => void;

  endGame: (data: Game) => void;
};

export type ClientToServerEvents = {
  joinRoom: (code: Room["code"]) => void;
  leaveRoom: (code: Room["code"]) => void;
  getGameSession: (room: Room, cb: (e: Game) => Promise<Game>) => void;
  chooseAnswer: (data: ChooseAnswerData) => void;
};

type UserSetReadyData = {
  user: User;
  updatedRoomData: Pick<Room, "canStart" | "playersReadiness">;
  action: ManagePlayerReadiness;
};

type UserJoinLeaveData = {
  action: ManagePlayersInRoom;
  user: User;
  updatedRoomData: Pick<Room, "players">;
};

export type ChooseAnswerData = {
  gameId: string;
  playerId: string;
  answerId: string;
};
