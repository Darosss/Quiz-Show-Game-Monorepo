"use client";
import Navigation from "@/components/navigation";
import { AuthContextProvider } from "@/components/auth";
import { ToastContainer } from "react-toastify";
import styles from "./layout.module.scss";
import { FC, ReactNode } from "react";
import { GameSessionContextProvider } from "@/components/game-session";
import { SocketEventsContextProvider } from "../socket-events";
import { UserDetails } from "@/components/user";

type LayoutContentProps = {
  children: ReactNode;
};

export const LayoutContent: FC<LayoutContentProps> = ({ children }) => {
  return (
    <SocketEventsContextProvider>
      <AuthContextProvider>
        <GameSessionContextProvider>
          <Navigation />
          <div className={styles.userDetailsWrapper}>
            <UserDetails />
          </div>
          <ToastContainer />
          <div className={styles.contentWrapper}>{children}</div>
        </GameSessionContextProvider>
      </AuthContextProvider>
    </SocketEventsContextProvider>
  );
};
