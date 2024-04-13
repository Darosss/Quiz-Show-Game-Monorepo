import { ManagePlayerReadiness } from "./enums";
import { Room, User } from "./types";
export type ServerToClientEvents = {
  userJoinedRoom: (user: User) => void;
  userLeftRoom: (user: User) => void;
  userSetReady: (user: User, action: ManagePlayerReadiness) => void;
};

export type ClientToServerEvents = {
  joinRoom: (code: Room["code"]) => void;
  leaveRoom: (code: Room["code"]) => void;
};
