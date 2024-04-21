import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import { FC, useEffect, useState } from "react";
import { useRoomLobbyContext } from "./room-lobby-context";
import { useFetch } from "@/hooks/useFetch";
import { addSecondsToDate } from "@/shared/index";

export const StartGameLogic: FC = () => {
  const { isOwner } = useRoomLobbyContext();

  const { fetchData: fetchStartAGame } = useFetch(
    {
      url: "rooms/start-a-game",
      method: "POST",
    },
    {
      manual: true,
      notification: { pendingText: "Trying to start a game. Please wait" },
    }
  );
  //TODO: temporary solution for now
  const [toTimestamp, setToTimestamp] = useState<string>();
  const { remainingTime, isFinished, resetTimer } = useCountdownTimer({
    toTimestamp: toTimestamp,
  });

  useEffect(() => {
    setToTimestamp(addSecondsToDate(3).toString());
  }, []);

  useEffect(() => {
    if (!isOwner) return;
    if (isFinished) {
      fetchStartAGame();
      resetTimer();
    }
  }, [fetchStartAGame, isOwner, isFinished, resetTimer]);

  return <div>Start in: {formatTime(remainingTime)}</div>;
};
