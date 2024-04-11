import { fetchBackendApi } from "@/api/fetch";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const ParticipantRoomActions: FC = () => {
  const router = useRouter();

  const fetchLeaveRoom = async () => {
    await fetchBackendApi<boolean>({
      url: "rooms/leave-current-room",
      method: "POST",
      notification: { pendingText: "Trying to log in. Please wait" },
    }).then((response) => {
      const data = response?.data;
      if (data) router.push("/");
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
