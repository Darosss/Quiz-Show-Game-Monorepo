import { FC } from "react";
import { PlayerDataGame } from "@/shared/types";
import styles from "./game-playing.module.scss";
import { useGameSessionContext } from "../game-session-context";
import { useRoomLobbyContext } from "../lobby/room-lobby-context";

export const GamePlayers: FC = () => {
  const {
    currentRoomApi: {
      api: { responseData: currentRoomApiData, setResponseData },
    },
  } = useRoomLobbyContext();

  const {
    currentGameSessionApi: {
      api: { responseData: currentGameSessionData },
    },
  } = useGameSessionContext();
  return currentRoomApiData.data?.players.map((player, index) => {
    if (!currentGameSessionData.data) return null;
    const { playersData } = currentGameSessionData.data;
    const currentPlayerData = Object.entries(playersData).find(
      ([id]) => id === player._id
    )?.[1] as PlayerDataGame | undefined;

    const showUserAnswer =
      currentPlayerData?.currentAnswer &&
      !currentGameSessionData.data.canAnswer;
    const userAnswered = !!currentPlayerData?.currentAnswer;
    return (
      <div
        key={player._id}
        className={`${styles.gamePlayersWrapper}
        ${
          showUserAnswer
            ? styles[`answer${currentPlayerData.currentAnswer}`]
            : userAnswered
            ? styles.answered
            : ""
        }`}
      >
        <div>{player.username}</div>
        <div>{currentPlayerData?.score}</div>
      </div>
    );
  });
};
