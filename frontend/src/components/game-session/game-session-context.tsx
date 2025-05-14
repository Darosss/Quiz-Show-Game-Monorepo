"use client";

import { UseFetchReturnType, useFetch } from "@/hooks/use-fetch";
import { FC, createContext, useContext } from "react";
import { RoomLobbyContextProvider } from "./lobby/room-lobby-context";
import { Game } from "@/shared/types";
import { useAuthContext } from "../auth";

type CurrentGameSessionResponseType = Game;
type GameSessionContextProviderProps = {
  children: React.ReactNode;
};

type GameSessionContextType = {
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
  const { isLoggedIn } = useAuthContext();
  const currentGameSessionApi = useFetch<CurrentGameSessionResponseType>(
    {
      url: "games/current-game-session",
      method: "GET",
    },
    { manual: !isLoggedIn }
  );

  return (
    <GameSessionContext.Provider value={{ currentGameSessionApi }}>
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
