import { fetchBackendApi } from "@/api/fetch";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useRoomLobbyContext } from "./room-lobby-context";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { ManagePlayerReadiness } from "@/shared/enums";
import { useAuthContext } from "@/components/auth";

export const ParticipantRoomActions: FC = () => {
  const router = useRouter();
  const {
    currentRoomApi: {
      api: { responseData },
      clearCache,
    },
  } = useRoomLobbyContext();

  const {
    emits: { leaveRoom },
  } = useSocketEventsContext();
  const fetchLeaveRoom = async () => {
    await fetchBackendApi<boolean>({
      url: "rooms/leave-current-room",
      method: "POST",
      notification: { pendingText: "Trying to leave room. Please wait" },
    }).then((response) => {
      const data = response?.data;
      if (data) {
        if (responseData.data) leaveRoom(responseData.data.code);
        clearCache();
        router.push("/");
      }
    });
  };

  return (
    <div>
      <Button onClick={fetchLeaveRoom} defaultButtonType="danger">
        Leave room
      </Button>
      <ReadyButton />
    </div>
  );
};

const ReadyButton: FC = () => {
  const {
    currentRoomApi: {
      api: { responseData, setResponseData },
    },
  } = useRoomLobbyContext();

  const {
    apiUser: {
      api: { data },
    },
  } = useAuthContext();
  const ready = !!responseData.data?.playersReadiness.find(
    (id) => id === data.sub
  );

  const fetchSetReady = async (action: ManagePlayerReadiness) => {
    await fetchBackendApi<string>({
      url: `rooms/set-ready/${action}`,
      method: "POST",
      notification: { pendingText: `Trying to be ${action} in. Please wait` },
    }).then((response) => {
      const data = response?.data;

      if (data)
        setResponseData((prevState) => {
          if (!prevState.data) return prevState;

          const { players, playersReadiness } = prevState.data;
          const newCanStart = players.length === playersReadiness.length;

          const newPlayersReadiness = ready
            ? playersReadiness.filter((id) => id !== data)
            : [...playersReadiness, data];

          const newState = {
            ...prevState,
            data: {
              ...prevState.data,
              playersReadiness: newPlayersReadiness,
              canStart: newCanStart,
            },
          };

          return newState;
        });
    });
  };

  return (
    <Button
      onClick={() => {
        fetchSetReady(
          ready ? ManagePlayerReadiness.NOT_READY : ManagePlayerReadiness.READY
        );
      }}
      defaultButtonType="secondary"
    >
      {ready ? "You are ready" : "Not ready"}
    </Button>
  );
};
