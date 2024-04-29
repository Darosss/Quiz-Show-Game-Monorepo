import { ManagePlayerReadiness, ManagePlayersInRoom } from "./enums";
import { Game, PlayerDataGame, Question, Room, User } from "./types";

export type ServerToClientEvents = {
  userJoinLeave: (data: UserJoinLeaveData) => void;
  userSetReady: (data: UserSetReadyData) => void;
  startGame: () => void;
  userChoseAnswer: (data: UserChoseAnswerData) => void;

  showNewQuestionInGame: (data: ShowNewQuestionInGameData) => void;

  showQuestionPossibleAnswers: (
    data: Pick<Game, "currentQuestion" | "currentTimer" | "canAnswer">
  ) => void;

  showQuestionCorrectAnswersInGame: (
    data: Pick<
      Game,
      "currentQuestion" | "currentTimer" | "playersData" | "canAnswer"
    >
  ) => void;

  //updateGameStage: For other simpler stages
  updateGameStage: (data: Pick<Game, "currentTimer">) => void;
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

export type ShowNewQuestionInGameData = {
  data: Pick<Game, "canAnswer" | "currentTimer" | "currentCategory">;
  questionData: QuestionData;
};

export type QuestionData = Pick<
  Question,
  "_id" | "question" | "createdAt" | "updatedAt" | "category"
>;

export type UserChoseAnswerData = {
  userAnswer: { [key: string]: PlayerDataGame };
};
