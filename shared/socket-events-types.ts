import { Room, User } from "./types";
export type ServerToClientEvents = {
  userJoinedRoom: (user: User) => void;
  userLeftRoom: (user: User) => void;
};

export type ClientToServerEvents = {
  joinRoom: (code: Room["code"]) => void;
  leaveRoom: (code: Room["code"]) => void;
};
