import { FC, useEffect, useState } from "react";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { useRoomLobbyContext } from "../lobby/room-lobby-context";
import { useGameSessionContext } from "../game-session-context";
import styles from "./game-playing.module.scss";
import { Button } from "../../common";
import { GamePlayers } from "./game-players";
import { GameTimers } from "./game-timers";
import { CurrentQuestion } from "./current-question";
import { GameSpeech } from "./game-speech";

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
    showNewQuestionInGame.on(({ data, questionData }) => {
      setShowCorrect(false);
      setResponseData((prevState) => {
        if (!prevState.data) return prevState;
        return {
          ...prevState,

          data: {
            ...prevState.data,
            ...data,
            currentQuestion: { ...questionData, answers: [] },
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

  if (!responseData.data) return <>TODO: No data refresh pelase </>;

  return (
    <div className={styles.gamePlayingWrapper}>
      {!responseData.data.isFinished ? (
        <>
          <div className={styles.speechOptions}>
            <GameSpeech />
          </div>
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
        </>
      ) : (
        <div className={styles.gameResultWrapper}>
          <h2>Game is finished. TODO: Match results or redirect</h2>
          <Button
            onClick={() => {
              clearGameSessionCache();
              fetchRoomLobbyData();
            }}
            defaultButtonType="info"
          >
            Back to room lobby
          </Button>
        </div>
      )}
    </div>
  );
};
