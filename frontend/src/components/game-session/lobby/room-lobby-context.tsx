import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { Room, User } from "@/shared/types";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { FC, createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
export type CurrentRoomResponseType = Room<User>;
type RoomLobbyContextType = {
  currentRoomApi: UseFetchReturnType<CurrentRoomResponseType, unknown>;
};

type RoomLobbyContextProvider = {
  children: React.ReactNode;
};
export const RoomLobbyContext = createContext<RoomLobbyContextType | null>(
  null
);

export const RoomLobbyContextProvider: FC<RoomLobbyContextProvider> = ({
  children,
}) => {
  const currentRoomApi = useFetch<CurrentRoomResponseType>({
    url: "rooms/current-room",
    method: "GET",
  });

  const {
    api: { responseData, setResponseData },
  } = currentRoomApi;

  const {
    emits: { joinRoom },
    events: { userJoinedRoom, userLeftRoom },
  } = useSocketEventsContext();

  useEffect(() => {
    if (responseData.data?.code) {
      joinRoom(responseData.data?.code);
    }
  }, [joinRoom, responseData.data?.code]);

  useEffect(() => {
    userJoinedRoom.on((user) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newPlayers = [...prevState.data.players, user];
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            players: newPlayers,
          },
        };
        return newState;
      });
      toast.info(`${user.username} joined the room`);
    });
    return () => {
      userJoinedRoom.off();
    };
  }, [userJoinedRoom, setResponseData]);

  useEffect(() => {
    userLeftRoom.on((leftUser) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newPlayers = prevState.data.players.filter(
          (user) => user._id !== leftUser._id
        );
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            players: newPlayers,
          },
        };
        return newState;
      });
      toast.info(`${leftUser.username} left the room`);
    });

    return () => {
      userLeftRoom.off();
    };
  }, [setResponseData, userLeftRoom]);

  return (
    <RoomLobbyContext.Provider value={{ currentRoomApi }}>
      {children}
    </RoomLobbyContext.Provider>
  );
};

export const useRoomLobbyContext = (): Required<RoomLobbyContextType> => {
  const roomLobbyContext = useContext(RoomLobbyContext);
  if (!roomLobbyContext) {
    throw new Error(
      "useGameSessionContext must be used within a RoomLobbyContextProvider"
    );
  }
  return roomLobbyContext as RoomLobbyContextType;
};
