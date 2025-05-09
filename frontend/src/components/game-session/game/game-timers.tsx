import { FC } from "react";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { formatTime } from "@/utils/utils";
import { useGameSessionContext } from "../game-session-context";

export const GameTimers: FC = () => {
  const {
    currentGameSessionApi: {
      api: { responseData: currentGameSessionData },
    },
  } = useGameSessionContext();
  const { remainingTime } = useCountdownTimer({
    toTimestamp: currentGameSessionData.data?.currentTimer?.date?.toString(),
  });

  return (
    <div>
      {remainingTime && currentGameSessionData.data?.currentTimer?.stage
        ? `${currentGameSessionData.data.currentTimer.stage}: ${formatTime(
            remainingTime
          )}`
        : null}
    </div>
  );
};
