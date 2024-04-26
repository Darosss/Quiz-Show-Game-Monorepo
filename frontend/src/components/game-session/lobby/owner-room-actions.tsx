import { Button } from "@/components/common";
import { FC, useState } from "react";
import styles from "./room-lobby.module.scss";
import { useRoomLobbyContext } from "./room-lobby-context";
import { prettierCamelCaseName } from "@/utils/utils";
import { Room, RoomOptions } from "@/shared/types";
import { fetchBackendApi } from "@/api/fetch";

export const OwnerRoomActions: FC = () => {
  return (
    <div className={styles.ownerRoomActionsWrapper}>
      <Button defaultButtonType="danger">Remove room</Button>
      <EditOptions />
    </div>
  );
};

const EditOptions: FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const {
    currentRoomApi: {
      api: { responseData: roomData, setResponseData },
    },
  } = useRoomLobbyContext();

  const [options, setOptions] = useState<RoomOptions | undefined>(
    roomData.data?.options
  );

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

          <div>
            <h3>Room options </h3>
            <div>
              <div>Max players</div>
              <input
                type="number"
                defaultValue={options.maxPlayers}
                onChange={(e) => {
                  setOptions((prevState) => {
                    if (!prevState) return undefined;

                    return {
                      ...prevState,
                      maxPlayers: e.target.valueAsNumber,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div>
            <h3>Game options </h3>
            {Object.entries(options.gameOptions).map(([name, value]) => (
              <div key={name}>
                <div>{prettierCamelCaseName(name)}</div>
                <input
                  type="number"
                  defaultValue={value}
                  onChange={(e) => {
                    setOptions((prevState) => {
                      if (!prevState) return undefined;

                      return {
                        ...prevState,
                        gameOptions: {
                          ...prevState.gameOptions,
                          [name]: e.target.valueAsNumber,
                        },
                      };
                    });
                  }}
                />
              </div>
            ))}
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
