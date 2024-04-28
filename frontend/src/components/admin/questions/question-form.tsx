import { Button } from "@/components/common";
import { Question } from "@/shared/types";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import styles from "./questions.module.scss";
import { QuestionAnswerTypeForm, QuestionCreateBody } from "./types";
import { CategorySelect } from "../categories/category-select";

type QuestionFormProps = {
  onSubmit: (data: QuestionCreateBody) => void;
  submitText: string;
  data?: Question;
  emptyAfterSubmit?: boolean;
};

export const QuestionForm: FC<QuestionFormProps> = ({
  onSubmit,
  submitText,
  data,
  emptyAfterSubmit,
}) => {
  const [question, setQuestion] = useState(data?.question || "");
  const [answers, setAnswers] = useState<QuestionAnswerTypeForm[]>(
    data?.answers || []
  );
  const [categoryId, setCategoryId] = useState(data?.category._id || "");
  return (
    <div className={styles.questionFormWrapper}>
      <div>
        <label> Question </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div>
        <label> Category </label>
        <CategorySelect
          onSelect={(categoryId) => setCategoryId(categoryId)}
          defaultValue={data?.category._id}
        />
      </div>
      <div>
        <label>Answers</label>
        <Button
          defaultButtonType="info"
          onClick={() => {
            setAnswers((prevState) => {
              const newState = [...prevState];
              newState.push({ name: `New answer ${prevState.length}` });

              return newState;
            });
          }}
        >
          Add answer
        </Button>
        <div className={styles.answersWrapper}>
          {answers.map((answer, index) => {
            return (
              <div key={answer.name + index}>
                <input
                  type="text"
                  defaultValue={answer.name}
                  onChange={(e) => {
                    setAnswers((prevState) => {
                      const newState = prevState;
                      newState[index].name = e.target.value;
                      return newState;
                    });
                  }}
                />
                {answer.isCorrect ? (
                  <Button
                    defaultButtonType="success"
                    onClick={() =>
                      setAnswers((prevState) => {
                        const newState = [...prevState];
                        newState[index].isCorrect = undefined;

                        return newState;
                      })
                    }
                  >
                    Correct
                  </Button>
                ) : (
                  <Button
                    defaultButtonType="danger"
                    onClick={() =>
                      setAnswers((prevState) => {
                        const newState = [...prevState];
                        newState[index].isCorrect = true;

                        return newState;
                      })
                    }
                  >
                    Wrong
                  </Button>
                )}

                <Button
                  defaultButtonType="danger"
                  onClick={() =>
                    setAnswers((prevState) => {
                      const newState = [...prevState];
                      newState.splice(index, 1);

                      return newState;
                    })
                  }
                >
                  X
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Button
          defaultButtonType="primary"
          onClick={() => {
            if (!question) return toast.info("Question must be provided");
            if (answers.length < 2)
              return toast.info("There need to be at least 2 answers");
            if (!categoryId) return toast.info("You need to set a category");

            onSubmit({ question, answers, categoryId });

            if (emptyAfterSubmit) {
              setQuestion("");
              setAnswers([]);
              setCategoryId("");
            }
          }}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};
