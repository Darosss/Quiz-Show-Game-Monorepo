import { FC, useEffect } from "react";
import { CreateRoomView } from "./create-room-view";
import { JoinRoomView } from "./join-room-view";
import styles from "./styles.module.scss";
import { useRoomLobbyContext } from "../game-session/lobby/room-lobby-context";

export const BaseRoomActions: FC = () => {
  const {
    currentRoomApi: { fetchData: fetchRoomLobbyData },
  } = useRoomLobbyContext();

  useEffect(() => {
    fetchRoomLobbyData();
  }, [fetchRoomLobbyData]);

  return (
    <div className={styles.baseRoomActionsWrapper}>
      <CreateRoomView />
      <JoinRoomView />
    </div>
  );
};
