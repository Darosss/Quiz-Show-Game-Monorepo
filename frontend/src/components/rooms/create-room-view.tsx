import { FC, FormEvent } from "react";
import { Button } from "../common";
import { fetchBackendApi } from "@/api/fetch";
import { useRouter } from "next/navigation";
type CreateRoomResponse = any;

type CreateRoomFetchBody = { name: string };
export const CreateRoomView: FC = () => {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    if (!name) return;

    await fetchBackendApi<CreateRoomResponse, CreateRoomFetchBody>({
      url: "rooms/create-room",
      method: "POST",
      body: { name: `${name}` },
      notification: { pendingText: "Trying to create room. Please wait" },
    }).then((response) => {
      const data = response?.data;
      if (!data) return;

      router.push("game");
    });
  };
  return (
    <div>
      <h2>Create room</h2>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input type="text" name="name" required />
          </div>

          <div>
            <Button type="submit" defaultButtonType="primary">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
