import { FC } from "react";
import { CreateRoomView } from "./create-room-view";
import { JoinRoomView } from "./join-room-view";
import styles from "./styles.module.scss";

export const BaseRoomActions: FC = () => {
  return (
    <div className={styles.baseRoomActionsWrapper}>
      <CreateRoomView />
      <JoinRoomView />
    </div>
  );
};
