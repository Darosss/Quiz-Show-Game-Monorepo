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

export type RoomOptions = {
  maxPlayers: number;

  gameOptions: GameOptions;
};

export type Room = CommonFieldTypes & {
  name: string;
  code: string;
  owner: User;
  players: User[];
  playersReadiness: string[];
  canStart: boolean;
  game: Game | null;
  options: RoomOptions;
};

export type UserTokenInfo = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};

export type Question = CommonFieldTypes & {
  question: string;
  answers: QuestionAnswerType[];
  category: Category;
};

export type QuestionAnswerType = {
  id: string;
  name: string;
  isCorrect?: boolean;
};

export type GameOptions = {
  questionsCount: number;
  timeForShowQuestionAnswersMs: number;
  timeForAnswerMs: number;
  timeForNextQuestionMs: number;
  timeForShowQuestionResult: number;

  pointsPerCorrect: number;
  pointsPerWrong: number;
};

export type CurrentTimerGame = {
  stage: CurrentTimerGameStage;
  date: Date;
};

export type PlayerDataGame = {
  score: number;
  currentAnswer?: string;
};

export type Game = CommonFieldTypes & {
  room: Room;
  currentQuestion: Question | null;
  currentCategory: string | null;
  canAnswer: boolean;
  currentTimer: CurrentTimerGame | null;
  currentQuestionNumber: number;
  options: GameOptions;
  isFinished: boolean;
  playersData: Map<string, PlayerDataGame>;
};

export type Category = CommonFieldTypes & {
  name: string;
};
