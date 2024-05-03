"use client";
import { FC } from "react";
import styles from "./home-content.module.scss";
import { BaseRoomActions } from "@/components/rooms";
import { useRoomLobbyContext } from "@/components/game-session/lobby/room-lobby-context";
import { VisitRoom } from "./visit-room";

export const HomeContent: FC = () => {
  const {
    currentRoomApi: {
      api: {
        responseData: { data: roomData },
      },
    },
  } = useRoomLobbyContext();
  return (
    <div className={styles.homeContentWrapper}>
      {roomData ? <VisitRoom /> : <BaseRoomActions />}
    </div>
  );
};
