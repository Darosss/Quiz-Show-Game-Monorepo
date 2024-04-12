import { fetchBackendApi } from "@/api/fetch";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useRoomLobbyContext } from "./room-lobby-context";
import { useSocketEventsContext } from "@/socket/socket-events-context";

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
      notification: { pendingText: "Trying to log in. Please wait" },
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
      <Button onClick={() => {}} defaultButtonType="info">
        Ready
      </Button>
    </div>
  );
};
