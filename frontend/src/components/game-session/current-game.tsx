"use client";
import { FC, useEffect, useMemo } from "react";
import { NoCurrentGame } from "./no-current-game";
import { RoomLobby } from "./lobby/room-lobby";
import { GamePlaying } from "./game/game-playing";
import { useRoomLobbyContext } from "./lobby/room-lobby-context";

export const CurrentGame: FC = () => {
  const {
    currentRoomApi: {
      api: {
        responseData: { data },
      },
      fetchData: fetchLobbyData,
    },
  } = useRoomLobbyContext();

  useEffect(() => {
    fetchLobbyData();
  }, [fetchLobbyData]);
  const CurrentSession = useMemo(() => {
    const isInRoom = !!data;
    const isRoomInGame = !!data?.game;

    if (isInRoom && isRoomInGame) return GamePlaying;
    if (isInRoom) return RoomLobby;
    return NoCurrentGame;
  }, [data]);

  return <CurrentSession />;
};
