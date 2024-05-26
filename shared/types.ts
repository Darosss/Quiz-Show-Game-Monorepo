import { CurrentTimerGameStage, PossibleLanguages, RolesUser } from "./enums";

export type TimeoutType = ReturnType<typeof setTimeout>;

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
  roles: RolesUser[];
};

export type Question = CommonFieldTypes & {
  question: Map<PossibleLanguages, string>;
  answers: QuestionAnswerType[];
  category: Category;
  possibleLanguages: PossibleLanguages[];
};

export type QuestionAnswerType = {
  id: string;
  name: Map<PossibleLanguages, string>;
  isCorrect?: boolean;
};

export type QuestionAnswerNameType = [];

export type GameOptions = {
  questionsCount: number;
  pointsPerCorrect: number;
  pointsPerWrong: number;
  showQuestionAnswersMs: number;
  answerTimeMs: number;
  nextQuestionMs: number;
  showQuestionResultMs: number;
  startGameMs: number;
  categoryChoiceMs: number;
  endGameMs: number;
  language: PossibleLanguages;
};

export type CurrentTimerGame = {
  stage: CurrentTimerGameStage;
  date: Date;
};

export type PlayerDataGame = {
  score: number;
  currentAnswer?: string;
  canChooseCategory?: boolean;
};

export type Game = CommonFieldTypes & {
  room: Room;
  currentQuestion: Question | null;
  currentCategory: Category | null;
  canAnswer: boolean;
  currentTimer: CurrentTimerGame | null;
  currentQuestionNumber: number;
  options: GameOptions;
  isFinished: boolean;
  playersData: Map<string, PlayerDataGame>;
};

export type Category = CommonFieldTypes & {
  name: Map<PossibleLanguages, string>;
};
