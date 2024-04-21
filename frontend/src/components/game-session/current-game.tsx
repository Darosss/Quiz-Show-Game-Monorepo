"use client";
import { FC, useEffect, useMemo } from "react";
import { useGameSessionContext } from "./game-session-context";
import { NoCurrentGame } from "./no-current-game";
import { RoomLobby } from "./lobby/room-lobby";
import { GamePlaying } from "./game-playing";
import { useRoomLobbyContext } from "./lobby/room-lobby-context";

export const CurrentGame: FC = () => {
  const {
    currentActionApi: {
      api: {
        responseData: { data },
      },
    },
  } = useGameSessionContext();

  const {
    currentRoomApi: { fetchData: fetchLobbyData },
  } = useRoomLobbyContext();
  useEffect(() => {
    fetchLobbyData();
  }, [fetchLobbyData]);

  const CurrentSession = useMemo(() => {
    switch (data?.currentAction) {
      case "IN_ROOM":
        return RoomLobby;
      case "PLAYING":
        return GamePlaying;
      default:
        return NoCurrentGame;
    }
  }, [data?.currentAction]);

  return (
    <div>
      <CurrentSession />
    </div>
  );
};
