import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { Room } from "@/shared/types";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { FC, createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
export type CurrentRoomResponseType = Room;
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
    events: { userJoinLeave, userSetReady },
  } = useSocketEventsContext();

  useEffect(() => {
    if (responseData.data?.code) {
      joinRoom(responseData.data?.code);
    }
  }, [joinRoom, responseData.data?.code]);

  useEffect(() => {
    userJoinLeave.on(({ user: userData, updatedRoomData, action }) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            players: updatedRoomData.players,
          },
        };
        return newState;
      });
      toast.info(`${userData.username} ${action} the room`);
    });
    return () => {
      userJoinLeave.off();
    };
  }, [userJoinLeave, setResponseData]);

  useEffect(() => {
    userSetReady.on(
      ({ user, updatedRoomData: { canStart, playersReadiness }, action }) => {
        setResponseData((prevState) => {
          if (!prevState.data) return prevState;

          const newState = {
            ...prevState,
            data: {
              ...prevState.data,
              playersReadiness,
              canStart,
            },
          };
          return newState;
        });
      }
    );

    return () => {
      userSetReady.off();
    };
  }, [setResponseData, userSetReady]);

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
