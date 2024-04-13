"use client";

import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { FC, createContext, useContext, useEffect } from "react";
import { RoomLobbyContextProvider } from "./lobby/room-lobby-context";
import { useSocketEventsContext } from "@/socket/socket-events-context";

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
  const {
    events: { startGame },
  } = useSocketEventsContext();

  useEffect(() => {
    startGame.on(() => {
      currentGameApi.fetchData();
    });

    return () => {
      startGame.off();
    };
  }, [currentGameApi, startGame]);

  return (
    <GameSessionContext.Provider value={{ currentGameApi }}>
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
