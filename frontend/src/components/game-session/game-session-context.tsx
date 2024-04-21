"use client";

import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { FC, createContext, useContext, useEffect } from "react";
import { RoomLobbyContextProvider } from "./lobby/room-lobby-context";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { Game } from "@/shared/types";
type CurrentActionUserResponseType = {
  currentAction: CurrentActionUser;
};
type CurrentGameSessionResponseType = Game;
export type CurrentActionUser = "IDLE" | "IN_ROOM" | "PLAYING";
type GameSessionContextProviderProps = {
  children: React.ReactNode;
};

type GameSessionContextType = {
  currentActionApi: UseFetchReturnType<CurrentActionUserResponseType, unknown>;
  currentGameSessionApi: UseFetchReturnType<
    CurrentGameSessionResponseType,
    unknown
  >;
};

export const GameSessionContext = createContext<GameSessionContextType | null>(
  null
);

export const GameSessionContextProvider: FC<
  GameSessionContextProviderProps
> = ({ children }) => {
  const currentActionApi = useFetch<CurrentActionUserResponseType>({
    url: "users/current-action",
    method: "GET",
  });

  const currentGameSessionApi = useFetch<CurrentGameSessionResponseType>({
    url: "games/current-game-session",
    method: "GET",
  });

  const {
    events: { startGame },
  } = useSocketEventsContext();

  useEffect(() => {
    startGame.on(() => {
      currentActionApi.fetchData();
    });

    return () => {
      startGame.off();
    };
  }, [currentActionApi, startGame]);

  return (
    <GameSessionContext.Provider
      value={{ currentActionApi, currentGameSessionApi }}
    >
      <RoomLobbyContextProvider>{children}</RoomLobbyContextProvider>
    </GameSessionContext.Provider>
  );
};

export const useGameSessionContext = (): Required<GameSessionContextType> => {
  const gameSessionContext = useContext(GameSessionContext);
  if (!gameSessionContext) {
    throw new Error(
      "useGameSessionContext must be used within a GameSessionContextProvider"
    );
  }
  return gameSessionContext as GameSessionContextType;
};
