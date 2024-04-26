import { useSocketEventsContext } from "@/socket/socket-events-context";
import { FC, useEffect, useState } from "react";
import { useRoomLobbyContext } from "./lobby/room-lobby-context";
import { useGameSessionContext } from "./game-session-context";
import { Game, PlayerDataGame, QuestionAnswerType } from "@/shared/types";
import { Button } from "../common";
import { useAuthContext } from "../auth";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { formatTime } from "@/utils/utils";
import styles from "./game-playing.module.scss";

export const GamePlaying: FC = () => {
  const [showCorrect, setShowCorrect] = useState(false);
  const {
    events: {
      userChoseAnswer,
      showNewQuestionInGame,
      showQuestionPossibleAnswers,
      showQuestionCorrectAnswersInGame,
      endGame,
      updateGameStage,
    },
  } = useSocketEventsContext();

  const {
    currentGameSessionApi: {
      api: { responseData, setResponseData },
      clearCache: clearGameSessionCache,
      fetchData: fetchCurrentGameSession,
    },
  } = useGameSessionContext();

  const {
    currentRoomApi: { fetchData: fetchRoomLobbyData },
  } = useRoomLobbyContext();

  useEffect(() => {
    fetchCurrentGameSession();
  }, [fetchCurrentGameSession]);

  useEffect(() => {
    userChoseAnswer.on(({ userAnswer }) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return {
          ...prevState,
          data: {
            ...prevState.data,
            playersData: {
              ...prevState.data.playersData,
              ...userAnswer,
            },
          },
        };
      });
    });
    return () => {
      userChoseAnswer.off();
    };
  }, [userChoseAnswer, setResponseData]);

  useEffect(() => {
    showNewQuestionInGame.on(({ data, questionText }) => {
      setShowCorrect(false);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return {
          ...prevState,
          data: {
            ...prevState.data,
            ...data,
            currentQuestion: { question: questionText, answers: {} },
          },
        };
      });
    });
    return () => {
      showNewQuestionInGame.off();
    };
  }, [showNewQuestionInGame, setResponseData]);

  useEffect(() => {
    showQuestionPossibleAnswers.on((data) => {
      setShowCorrect(false);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return { ...prevState, data: { ...prevState.data, ...data } };
      });
    });
    return () => {
      showQuestionPossibleAnswers.off();
    };
  }, [showQuestionPossibleAnswers, setResponseData]);

  useEffect(() => {
    showQuestionCorrectAnswersInGame.on((data) => {
      setShowCorrect(true);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return { ...prevState, data: { ...prevState.data, ...data } };
      });
    });
    return () => {
      showQuestionCorrectAnswersInGame.off();
    };
  }, [showQuestionCorrectAnswersInGame, setResponseData]);

  useEffect(() => {
    endGame.on((data) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return { ...prevState, data: { ...prevState.data, ...data } };
      });
    });
    return () => {
      endGame.off();
    };
  }, [endGame, setResponseData]);

  useEffect(() => {
    updateGameStage.on((data) => {
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return { ...prevState, data: { ...prevState.data, ...data } };
      });
    });
    return () => {
      updateGameStage.off();
    };
  }, [updateGameStage, setResponseData]);
  return (
    <div className={styles.gamePlayingWrapper}>
      {!responseData.data?.isFinished ? (
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
      ) : (
        <>
          <h2>Game is finished. TODO: Match results or redirect</h2>
          <Button
            onClick={() => {
              clearGameSessionCache();
              fetchRoomLobbyData();
            }}
          >
            Back to room lobby
          </Button>
        </>
      )}
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
      {remainingTime && currentGameSessionData.data?.currentTimer?.stage
        ? `${currentGameSessionData.data.currentTimer.stage}: ${formatTime(
            remainingTime
          )}`
        : null}
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
    if (!currentGameSessionData.data) return null;
    const { playersData } = currentGameSessionData.data;
    const currentPlayerData = Object.entries(playersData).find(
      ([id]) => id === player._id
    )?.[1] as PlayerDataGame | undefined;

    return (
      <div
        key={player._id}
        className={`${styles.gamePlayersWrapper} ${
          currentPlayerData?.currentAnswer ? styles.answered : ""
        }`}
      >
        <div>{player.username}</div>
        <div>{currentPlayerData?.score}</div>
        <div>
          {!currentGameSessionData.data.canAnswer
            ? currentPlayerData?.currentAnswer
            : null}
        </div>
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
              //TODO: remove possibilty when already choosen answer.
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
