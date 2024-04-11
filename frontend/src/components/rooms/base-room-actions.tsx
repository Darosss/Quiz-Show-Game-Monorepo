import { FC, useMemo, useState } from "react";
import { CreateRoomView } from "./create-room-view";
import { JoinRoomView } from "./join-room-view";
import { Button } from "@/components/common";
import styles from "./styles.module.scss";
enum CurrentHomeView {
  CREATE = "Create room",
  JOIN_ROOM = "Join to room",
}
export const BaseRoomActions: FC = () => {
  const [currentView, setCurrentView] = useState(CurrentHomeView.CREATE);

  const CurrentViewComponent = useMemo(() => {
    switch (currentView) {
      case CurrentHomeView.JOIN_ROOM:
        return JoinRoomView;
      case CurrentHomeView.CREATE:
      default:
        return CreateRoomView;
    }
  }, [currentView]);

  return (
    <div className={styles.baseRoomActionsWrapper}>
      {Object.entries(CurrentHomeView).map(([key, value]) =>
        value !== currentView ? (
          <Button
            key={key}
            defaultButtonType="primary"
            onClick={() => setCurrentView(value)}
          >
            {value}
          </Button>
        ) : null
      )}
      <div className={styles.baseRoomActionsContent}>
        <CurrentViewComponent />
      </div>
    </div>
  );
};
