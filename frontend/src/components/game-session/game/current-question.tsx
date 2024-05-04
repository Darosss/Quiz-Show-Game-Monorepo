import { FC } from "react";
import { QuestionAnswerType } from "@/shared/types";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { useAuthContext } from "@/components/auth";
import { Button } from "@/components/common";
import styles from "./game-playing.module.scss";
import { useGameSessionContext } from "../game-session-context";
type CurrentQuestionProps = {
  showCorrect: boolean;
};

export const CurrentQuestion: FC<CurrentQuestionProps> = ({ showCorrect }) => {
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
    currentCategory,
    currentQuestion: { question, answers },
    options: { language },
  } = gameSessionData.data;
  return (
    <div className={styles.currentQuestionWrapper}>
      <h2>
        {currentCategory
          ? new Map(Object.entries(currentCategory.name)).get(language)
          : null}
      </h2>
      <h3>{new Map(Object.entries(question)).get(language)}</h3>
      <div className={styles.answersWrapper}>
        {Object.entries(answers).map(
          ([id, data]: [string, QuestionAnswerType], index) => (
            <Button
              key={id + index}
              className={`${
                showCorrect && data.isCorrect ? styles.answerCorrect : ""
              }
                  `}
              onClick={() => {
                if (gameSessionData.data?.canAnswer) {
                  chooseAnswer({
                    answerId: id,
                    playerId: authData.sub,
                    gameId: gameSessionId,
                  });
                }
              }}
            >
              {new Map(Object.entries(data.name)).get(language)}
              <div
                className={`${styles.answerSign} 
                  ${styles[`answer${id}`]}
                `}
              ></div>
            </Button>
          )
        )}
      </div>
    </div>
  );
};
