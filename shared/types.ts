import { CurrentActionUser, RolesUser } from "./enums";

type CommonFieldTypes = {
  _id: string;
  //TODO: createdAt updatedAt and others?
};

export type User = CommonFieldTypes & {
  username: string;
  password: string;
  roles: RolesUser[];
  currentAction: CurrentActionUser;
  currentRoom?: Room;
};

export type Room<Owner = string | User> = CommonFieldTypes & {
  name: string;
  code: string;
  owner: Owner;
  players: User[];
};

export type UserTokenInfo = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};
