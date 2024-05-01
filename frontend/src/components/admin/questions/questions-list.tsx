import { FC, useState } from "react";
import { Button, FetchingInfo } from "@/components/common";
import { useFetch } from "@/hooks/useFetch";
import { Question } from "@/shared/types";
import styles from "./questions.module.scss";
import { PossibleLanguages } from "@/shared/enums";

type QuestionsListProps = {
  onEdit: (question: Question) => void;
};

export const QuestionsList: FC<QuestionsListProps> = ({ onEdit }) => {
  const [currentLanguageFocus, setCurrentLanguageFocus] = useState(
    PossibleLanguages.EN
  );
  const {
    api: { isPending, error, responseData },
  } = useFetch<Question[]>({
    url: "questions",
    method: "GET",
  });
  if (!responseData.data || error || isPending)
    return <FetchingInfo isPending={isPending} error={error} />;
  return (
    <div className={styles.questionsListWrapper}>
      <h2> Questions list</h2>
      <div>
        {Object.values(PossibleLanguages).map((language) => (
          <Button
            key={language}
            onClick={() => setCurrentLanguageFocus(language)}
            defaultButtonType={`${
              currentLanguageFocus === language ? "success" : "primary"
            }`}
          >
            {language}
          </Button>
        ))}
      </div>
      <div className={styles.questionTableDataWrapper}>
        <div className={styles.questionListHeaderWrapper}>
          <div>Question name</div>
          <div>Category</div>
          <div>Action</div>
        </div>
        <div>
          {responseData.data.map((question) => {
            const mappedQuestions = new Map(
              Object.entries(question.question)
            ).get(currentLanguageFocus);

            if (!mappedQuestions) return;
            return (
              <div key={question._id} className={styles.questionsListData}>
                <div className={styles.questionName}>
                  {new Map(Object.entries(question.question)).get(
                    currentLanguageFocus
                  )}
                </div>
                <div className={styles.questionCategory}>
                  {question.category.name}
                </div>
                <div>
                  <Button
                    defaultButtonType="info"
                    onClick={() => onEdit(question)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
