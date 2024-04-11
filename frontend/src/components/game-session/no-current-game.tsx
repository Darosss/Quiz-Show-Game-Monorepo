import { FC } from "react";
import { BaseRoomActions } from "../rooms";

export const NoCurrentGame: FC = () => {
  return (
    <>
      <h2>No current game</h2>

      <BaseRoomActions />
    </>
  );
};
