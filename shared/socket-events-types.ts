import { ManagePlayerReadiness, ManagePlayersInRoom } from "./enums";
import { Room, User } from "./types";
export type ServerToClientEvents = {
  userJoinLeave: (data: UserJoinLeaveData) => void;
  userSetReady: (data: UserSetReadyData) => void;
  startGame: () => void;
};

export type ClientToServerEvents = {
  joinRoom: (code: Room["code"]) => void;
  leaveRoom: (code: Room["code"]) => void;
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
