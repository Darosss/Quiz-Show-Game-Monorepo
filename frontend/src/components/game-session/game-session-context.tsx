"use client";

import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { FC, createContext, useContext } from "react";

export type CurrentActionUser = "IDLE" | "IN_ROOM" | "PLAYING";
type GameSessionContextProviderProps = {
  children: React.ReactNode;
};

type GameSessionContextType = {
  currentGameApi: UseFetchReturnType<CurrentActionUserResponseType, unknown>;
};
type CurrentActionUserResponseType = {
  currentAction: CurrentActionUser;
};
export const GameSessionContext = createContext<GameSessionContextType | null>(
  null
);

export const GameSessionContextProvider: FC<
  GameSessionContextProviderProps
> = ({ children }) => {
  const currentGameApi = useFetch<CurrentActionUserResponseType>({
    url: "users/current-action",
    method: "GET",
  });
  return (
    <GameSessionContext.Provider value={{ currentGameApi }}>
      {children}
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
