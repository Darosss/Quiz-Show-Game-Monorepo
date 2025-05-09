import { getRemainingTimeFromDateToDate } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";

interface UseRemainingTimeProps {
  toTimestamp?: string;
}

export const useCountdownTimer = ({ toTimestamp }: UseRemainingTimeProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState(false);

  const resetTimer = useCallback(() => {
    setRemainingTime(-1);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    if (!toTimestamp) return;
    const remainingTimeMs = getRemainingTimeFromDateToDate({
      timestamp: Date.now(),
      toTimestamp: new Date(toTimestamp).getTime(),
    });

    if (remainingTimeMs <= 0) return;

    setRemainingTime(remainingTimeMs);

    const intervalId = setInterval(() => {
      setRemainingTime((prevCounter) => {
        const newTime = Math.max(0, prevCounter - 1000);
        if (newTime === 0) {
          clearInterval(intervalId);
          setRemainingTime(-1);
          setIsFinished(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [toTimestamp]);

  return { remainingTime, isFinished, resetTimer };
};
