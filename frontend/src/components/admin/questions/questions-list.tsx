import { FC } from "react";
import { Button, FetchingInfo } from "@/components/common";
import { useFetch } from "@/hooks/useFetch";
import { Question } from "@/shared/types";
import styles from "./questions.module.scss";

type QuestionsListProps = {
  onEdit: (question: Question) => void;
};

export const QuestionsList: FC<QuestionsListProps> = ({ onEdit }) => {
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
        <div className={styles.questionListHeaderWrapper}>
          <div>Question name</div>
          <div>Category</div>
          <div>Action</div>
        </div>

        {responseData.data.map((question) => (
          <div key={question._id} className={styles.questionsListData}>
            <div>{question.question}</div>
            <div>{question.category.name}</div>
            <div>
              <Button defaultButtonType="info" onClick={() => onEdit(question)}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
