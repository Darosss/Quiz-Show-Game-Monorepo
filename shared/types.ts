import { CurrentTimerGameStage, RolesUser } from "./enums";

type CommonFieldTypes = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = CommonFieldTypes & {
  username: string;
  password: string;
  roles: RolesUser[];
  currentRoom?: Room;
};

export type Room = CommonFieldTypes & {
  name: string;
  code: string;
  owner: User;
  players: User[];
  playersReadiness: string[];
  canStart: boolean;
  game: Game | null;
};

export type UserTokenInfo = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};

export type QuestionAnswerType = {
  isCorrect?: boolean;
  name: string;
};

export type CurrentQuestionType = {
  question: string;
  answers: Map<string, QuestionAnswerType>;
};

export type GameOptions = {
  questionsCount: number;
  timeForShowQuestionAnswersMs: number;
  timeForAnswerMs: number;
  timeForNextQuestionMs: number;
  timeForShowQuestionResult: number;
};

export type CurrentTimerGame = {
  stage: CurrentTimerGameStage;
  date: Date;
};

export type Game = CommonFieldTypes & {
  room: Room;
  currentQuestion: CurrentQuestionType | null;
  currentCategory: string | null;
  canAnswer: boolean;
  currentTimer: CurrentTimerGame | null;
  currentPlayersAnswers: Map<String, String>;
  currentQuestionNumber: number;
  options: GameOptions;
  isFinished: boolean;
};
