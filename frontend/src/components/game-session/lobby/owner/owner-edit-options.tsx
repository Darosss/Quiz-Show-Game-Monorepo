import { fetchBackendApi } from "@/api/fetch";
import { Button } from "@/components/common";
import { RoomOptions, Room } from "@/shared/types";
import { FC, useCallback, useState } from "react";
import { useRoomLobbyContext } from "../room-lobby-context";
import styles from "../room-lobby.module.scss";
import { RoomOptions as RoomOptionsComp } from "./room-options";
import { GameOptions } from "./game-options";

enum PossibleOptionsTabs {
  ROOM = "Room ",
  GAME = "Game ",
}

export const EditOptions: FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [currentOptsTab, setCurrentOptsTab] = useState(
    PossibleOptionsTabs.ROOM
  );
  const {
    currentRoomApi: {
      api: { responseData: roomData },
    },
  } = useRoomLobbyContext();

  const [options, setOptions] = useState<RoomOptions | undefined>(
    roomData.data?.options
  );

  const CurrentTabComponent = useCallback(() => {
    if (!options) return <></>;
    switch (currentOptsTab) {
      case PossibleOptionsTabs.ROOM:
        return <RoomOptionsComp options={options} setOptions={setOptions} />;
      case PossibleOptionsTabs.GAME:
        return <GameOptions options={options} setOptions={setOptions} />;
    }
  }, [currentOptsTab, options]);

  if (!roomData.data || !options) return <></>;

  const handleOnSaveOptions = () => {
    if (!roomData.data) return;
    fetchBackendApi<Room, RoomOptions>({
      url: `rooms/${roomData.data?._id}/update-options`,
      body: options,
      method: "PATCH",
      notification: { pendingText: "Trying to update room options" },
    }).then((response) => {
      if (response.data) setShowOptions(false);
    });
  };

  return (
    <>
      <Button defaultButtonType="info" onClick={() => setShowOptions(true)}>
        Edit options
      </Button>

      <div
        className={`${styles.editOptionsWrapper}
      ${showOptions ? styles.showOptions : ""}
      `}
      >
        <div>
          <h2>Options </h2>
          {Object.values(PossibleOptionsTabs).map((val) => (
            <Button
              key={val}
              defaultButtonType={
                val === currentOptsTab ? "success" : "secondary"
              }
              onClick={() => setCurrentOptsTab(val)}
            >
              {val}
            </Button>
          ))}
          <div className={styles.optionsWrapper}>
            <div>
              <h3>{currentOptsTab} options </h3>
              <div>
                <CurrentTabComponent />
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div className={styles.buttonsActionsWrapper}>
          <Button defaultButtonType="success" onClick={handleOnSaveOptions}>
            Save
          </Button>
          <Button
            defaultButtonType="danger"
            onClick={() => setShowOptions(false)}
          >
            X
          </Button>
        </div>
      </div>
    </>
  );
};
