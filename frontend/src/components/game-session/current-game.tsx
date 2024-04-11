"use client";
import { FC } from "react";
import { useGameSessionContext } from "./game-session-context";
import { NoCurrentGame } from "./no-current-game";
import { RoomLobby } from "./lobby/room-lobby";
import { GamePlaying } from "./game-playing";

export const CurrentGame: FC = () => {
  const {
    currentGameApi: {
      api: {
        responseData: { data },
      },
    },
  } = useGameSessionContext();

  const CurrentSession = () => {
    switch (data?.currentAction) {
      case "IN_ROOM":
        return <RoomLobby />;
      case "PLAYING":
        return <GamePlaying />;
      default:
        return <NoCurrentGame />;
    }
  };

  return (
    <div>
      <CurrentSession />
    </div>
  );
};
