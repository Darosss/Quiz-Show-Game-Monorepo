import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import { FC, useEffect, useState } from "react";

export const StartGameLogic: FC = () => {
  //TODO: temporary solution for now
  const [toTimestamp, setToTimestamp] = useState(new Date().toString());
  const timer = useCountdownTimer({
    toTimestamp: toTimestamp,
  });

  useEffect(() => {
    const currentDate = new Date();
    const updatedDate = new Date(currentDate.getTime() + 10 * 1000);

    setToTimestamp(updatedDate.toString());
  }, []);
  return <div>Start in: {formatTime(timer)}</div>;
};
