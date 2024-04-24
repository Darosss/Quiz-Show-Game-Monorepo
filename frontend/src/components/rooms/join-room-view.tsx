import { FC, FormEvent } from "react";
import { Button } from "../common";
import { fetchBackendApi } from "@/api/fetch";
import { useRouter } from "next/navigation";
import { Room } from "@/shared/index";

type JoinRoomResponse = Room;

export const JoinRoomView: FC = () => {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code");
    if (!code) return;

    await fetchBackendApi<JoinRoomResponse>({
      url: `rooms/join-room/${code}`,
      method: "POST",
      notification: { pendingText: "Trying to join room. Please wait" },
    }).then((response) => {
      const data = response?.data;
      if (!data) return;

      router.push("game");
    });
  };
  return (
    <div>
      <h2>Join to room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room code</label>
          <input type="text" name="code" required />
        </div>

        <div>
          <Button type="submit" defaultButtonType="primary">
            Join
          </Button>
        </div>
      </form>
    </div>
  );
};
