import { FC, useEffect, useState } from "react";
import { useSocketEventsContext } from "@/socket/socket-events-context";
import { useAuthContext } from "@/components/auth";
import styles from "./game-playing.module.scss";
import { useGameSessionContext } from "../game-session-context";
import { Category, PlayerDataGame } from "@/shared/types";
import { Button } from "@/components/common";

export const CategoryChoice: FC = () => {
  const [possibleCategories, setPossibleCategories] = useState<Category[]>([]);
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
    emits: { chooseCategory },
    events: { showChooseCategoryStage },
  } = useSocketEventsContext();

  useEffect(() => {
    showChooseCategoryStage.on((data) => {
      console.log(data);
      setPossibleCategories(data);
    });

    return () => {
      showChooseCategoryStage.off();
    };
  }, [showChooseCategoryStage]);

  if (!gameSessionData.data) return null;
  const {
    _id: gameSessionId,
    options: { language },
    playersData,
  } = gameSessionData.data;

  const canChooseCategory: PlayerDataGame = new Map(
    Object.entries(playersData)
  ).get(authData.sub).canChooseCategory;
  return (
    <div className={styles.categoryChoiceWrapper}>
      <h2>Category choice</h2>
      <div>
        {possibleCategories.map((category) => {
          const categoryName = new Map(Object.entries(category.name)).get(
            language
          );
          return canChooseCategory ? (
            <Button
              key={category._id}
              onClick={() =>
                chooseCategory({
                  categoryId: category._id,
                  gameId: gameSessionId,
                  playerId: authData.sub,
                })
              }
            >
              {categoryName}
            </Button>
          ) : (
            <div>{categoryName}</div>
          );
        })}
      </div>
    </div>
  );
};
