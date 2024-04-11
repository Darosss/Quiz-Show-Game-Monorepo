import { Room, User } from "./types";
export type ServerToClientEvents = {
  userJoinedRoom: (user: User) => void;
  userLeftRoom: (userId: string, username: string) => void;
};

export type ClientToServerEvents = {
  joinRoom: (code: Room["code"]) => void;
  leaveRoom: (code: Room["code"]) => void;
};
