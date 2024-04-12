import { FC, createContext, useContext, useEffect, useMemo } from "react";
import { Socket, io } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/shared/socket-events-types";
import { getSocketEventsFunctions } from "./events";
import { getSocketEmitsFunctions } from "./emits";
import { SocketContexType } from "./types";
type SocketEventsContextProviderProps = {
  children: React.ReactNode;
};

export const SocketEventsContext = createContext<SocketContexType | null>(null);

export const SocketEventsContextProvider: FC<
  SocketEventsContextProviderProps
> = ({ children }) => {
  const ioConnection = io(process.env.NEXT_PUBLIC_BACKEND_URL) as Socket<
    ServerToClientEvents,
    ClientToServerEvents
  >;
  const emits = useMemo<SocketContexType["emits"]>(() => {
    return getSocketEmitsFunctions(ioConnection);
  }, [ioConnection]);

  const events = useMemo<SocketContexType["events"]>(() => {
    return getSocketEventsFunctions(ioConnection);
  }, [ioConnection]);
  useEffect(() => {
    if (!ioConnection || !events) return;

    //TODO: backend
    // events.forceReconnect.on(() => {
    //   ioConnection.disconnect();

    //   ioConnection.connect();
    // });

    // return () => {
    //   events.forceReconnect.off();
    // };
  }, [ioConnection, events]);
  return (
    <SocketEventsContext.Provider value={{ emits, events }}>
      {children}
    </SocketEventsContext.Provider>
  );
};

export const useSocketEventsContext = (): Required<SocketContexType> => {
  const socketEventsContext = useContext(SocketEventsContext);
  if (!socketEventsContext) {
    throw new Error(
      "useSocketEventsContext must be used within a SocketEventsContextProvider"
    );
  }
  return socketEventsContext as SocketContexType;
};
