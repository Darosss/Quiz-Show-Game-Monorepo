import { Button } from "@/components/common";
import { FC } from "react";
import styles from "../room-lobby.module.scss";
import { EditOptions } from "./owner-edit-options";

export const OwnerRoomActions: FC = () => {
  return (
    <div className={styles.ownerRoomActionsWrapper}>
      <Button defaultButtonType="danger">Remove room</Button>
      <EditOptions />
    </div>
  );
};
