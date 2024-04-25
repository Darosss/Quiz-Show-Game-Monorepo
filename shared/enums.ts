export enum RolesUser {
  User = "user",
  Admin = "admin",
  SuperAdmin = "super_admin",
}

export enum ManagePlayerReadiness {
  READY = "READY",
  NOT_READY = "NOT READY",
}

export enum ManagePlayersInRoom {
  JOIN = "Join",
  LEAVE = "Leave",
}

export enum CurrentTimerGameStage {
  GAME_STARTING = "GAME STARTING",
  QUESTION_RESULT = "QUESTION RESULT",
  NEW_QUESTION = "NEW QUESTION",
  ANSWER_TIME = "ANSWER TIME",
  QUESTION = "QUESTION",
}
