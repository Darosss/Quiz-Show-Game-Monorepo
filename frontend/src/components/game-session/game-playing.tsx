import { useSocketEventsContext } from "@/socket/socket-events-context";
import { FC, useEffect, useState } from "react";
import { useRoomLobbyContext } from "./lobby/room-lobby-context";
import { useGameSessionContext } from "./game-session-context";
import { Game, QuestionAnswerType } from "@/shared/types";
import { Button } from "../common";
import { useAuthContext } from "../auth";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import styles from "./game-playing.module.scss";

export const GamePlaying: FC = () => {
  const [showCorrect, setShowCorrect] = useState(false);
  const {
    emits: { getGameSession },
    events: {
      userChoseAnswer,
      newQuestionInGame,
      showCurrentQuestionAnswersInGame,
      endGame,
    },
  } = useSocketEventsContext();

  const {
    currentGameSessionApi: {
      api: { responseData, setResponseData },
      fetchData: fetchCurrentGameSession,
    },
  } = useGameSessionContext();

  useEffect(() => {
    fetchCurrentGameSession();
  }, [fetchCurrentGameSession]);

  useEffect(() => {
    userChoseAnswer.on((currentPlayersAnswers) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            currentPlayersAnswers: currentPlayersAnswers,
          },
        };
        return newState;
      });
    });
    return () => {
      userChoseAnswer.off();
    };
  }, [userChoseAnswer, setResponseData]);

  useEffect(() => {
    newQuestionInGame.on((data) => {
      setShowCorrect(false);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            ...data,
          },
        };
        return newState;
      });
    });
    return () => {
      newQuestionInGame.off();
    };
  }, [newQuestionInGame, setResponseData]);

  useEffect(() => {
    showCurrentQuestionAnswersInGame.on((data) => {
      setShowCorrect(true);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            ...data,
          },
        };
        return newState;
      });
    });
    return () => {
      showCurrentQuestionAnswersInGame.off();
    };
  }, [showCurrentQuestionAnswersInGame, setResponseData]);

  useEffect(() => {
    endGame.on((data) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        const newState = {
          ...prevState,
          data: {
            ...prevState.data,
            ...data,
          },
        };
        return newState;
      });
    });
    return () => {
      endGame.off();
    };
  }, [endGame, setResponseData]);
  return (
    <div className={styles.gamePlayingWrapper}>
      {responseData.data?.isFinished ? (
        <div className={styles.gameDetailsWrapper}>
          <div className={styles.timer}>
            <GameTimers />
          </div>
          <div className={styles.players}>
            <GamePlayers />
          </div>
          <div className={styles.gameDetails}>
            <CurrentQuestion showCorrect={showCorrect} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const GameTimers: FC = () => {
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
      {currentGameSessionData.data?.currentTimer?.stage}:
      {formatTime(remainingTime)}
    </div>
  );
};

const GamePlayers: FC = () => {
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
    console.log(currentGameSessionData.data?.currentPlayersAnswers, "aha");
    if (!currentGameSessionData.data) return null;
    const { currentPlayersAnswers } = currentGameSessionData.data;
    const alreadyAnswered = Object.entries(currentPlayersAnswers).find(
      ([id]) => id === player._id
    )?.[1] as String;

    return (
      <div
        key={player._id}
        style={{ background: alreadyAnswered ? "orange" : "" }}
      >
        {player.username}
      </div>
    );
  });
};

type CurrentQuestionProps = {
  showCorrect: boolean;
};

const CurrentQuestion: FC<CurrentQuestionProps> = ({ showCorrect }) => {
  const {
    apiUser: {
      api: { data: authData },
    },
  } = useAuthContext();
  const {
    currentGameSessionApi: {
      api: { responseData: gameSessionData },
    },
  } = useGameSessionContext();

  const {
    emits: { chooseAnswer },
  } = useSocketEventsContext();
  console.log(chooseAnswer);
  if (!gameSessionData.data || !gameSessionData.data?.currentQuestion)
    return null;
  const {
    _id: gameSessionId,
    currentQuestion: { question, answers },
  } = gameSessionData.data;
  return (
    <div className={styles.currentQuestionWrapper}>
      <h2>{question}</h2>
      <div className={styles.answersWrapper}>
        {Object.entries(answers).map(
          ([id, data]: [string, QuestionAnswerType]) => (
            <Button
              key={id + data.name}
              defaultButtonType={`${
                showCorrect && data.isCorrect ? "success" : "primary"
              }`}
              onClick={() =>
                chooseAnswer({
                  answerId: id,
                  playerId: authData.sub,
                  gameId: gameSessionId,
                })
              }
            >
              {data.name}
            </Button>
          )
        )}
      </div>
    </div>
  );
};
