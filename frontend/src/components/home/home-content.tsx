"use client";
import { FC } from "react";
import styles from "./home-content.module.scss";
import { BaseRoomActions } from "@/components/rooms";
import { useRoomLobbyContext } from "@/components/game-session/lobby/room-lobby-context";
import { VisitRoom } from "./visit-room";
import { useAuthContext } from "../auth";

export const HomeContent: FC = () => {
  const {
    currentRoomApi: {
      api: {
        responseData: { data: roomData },
      },
    },
  } = useRoomLobbyContext();
  const { isLoggedIn } = useAuthContext();

  return (
    <div className={styles.homeContentWrapper}>
      {!isLoggedIn ? null : roomData ? <VisitRoom /> : <BaseRoomActions />}
    </div>
  );
};
