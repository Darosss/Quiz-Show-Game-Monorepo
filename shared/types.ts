import { CurrentActionUser, RolesUser } from "./enums";

type CommonFieldTypes = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = CommonFieldTypes & {
  username: string;
  password: string;
  roles: RolesUser[];
  currentAction: CurrentActionUser;
  currentRoom?: Room;
};

export type Room = CommonFieldTypes & {
  name: string;
  code: string;
  owner: User;
  players: User[];
  playersReadiness: string[];
  canStart: boolean;
};

export type UserTokenInfo = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};
