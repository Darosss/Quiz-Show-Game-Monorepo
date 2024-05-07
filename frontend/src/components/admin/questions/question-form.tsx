import { Button } from "@/components/common";
import { Question, QuestionAnswerType } from "@/shared/types";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import styles from "./questions.module.scss";
import {
  QuestionAnswerTypeForm,
  QuestionCreateBody,
  QuestionCreateBodyAnswers,
} from "./types";
import { CategorySelect } from "../categories/category-select";
import { PossibleLanguages } from "@/shared/enums";
import React from "react";
import { validateOnSubmitQuestion } from "./question-form-validation";

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
  const [question, setQuestion] = useState<Map<PossibleLanguages, string>>(
    data?.question
      ? (new Map(Object.entries(data.question)) as Map<
          PossibleLanguages,
          string
        >)
      : new Map<PossibleLanguages, string>()
  );
  const [answers, setAnswers] = useState<QuestionAnswerTypeForm[]>(
    data?.answers || []
  );
  const [categoryId, setCategoryId] = useState(data?.category._id || "");
  const [possibleLanguages, setPossibleLanguages] = useState(
    data?.possibleLanguages || [PossibleLanguages.EN]
  );
  const [currentLanguageFocus, setCurrentLanguageFocus] = useState(
    possibleLanguages.at(0) || PossibleLanguages.EN
  );
  return (
    <div className={styles.questionFormWrapper}>
      <div>
        <label> Languages </label>
        <div>
          {Object.values(PossibleLanguages).map((language) => (
            <React.Fragment key={language}>
              {possibleLanguages.includes(language) ? (
                <Button
                  onClick={() =>
                    currentLanguageFocus !== language
                      ? setCurrentLanguageFocus(language)
                      : null
                  }
                  defaultButtonType={`${
                    currentLanguageFocus === language ? "success" : "primary"
                  }`}
                >
                  Edit {language}
                </Button>
              ) : (
                <Button
                  defaultButtonType="info"
                  onClick={() => {
                    setPossibleLanguages((prevState) => {
                      prevState.push(language);
                      const uniquePossLanguages = new Set(prevState);
                      return Array.from(uniquePossLanguages);
                    });

                    if (answers.length > 0) {
                      setAnswers((prevState) => {
                        return prevState.map<QuestionAnswerTypeForm>(
                          (answer, index) => {
                            const previousMap = answer.name;
                            const valueInAnotherLanguage = possibleLanguages.at(
                              0
                            )
                              ? previousMap.get(possibleLanguages.at(0)!)
                              : null;
                            previousMap.set(
                              language,
                              `Change "${valueInAnotherLanguage}" to: ${language} ${index}`
                            );
                            return {
                              ...answer,
                              name: previousMap,
                            };
                          }
                        );
                      });
                    }
                    setCurrentLanguageFocus(language);
                  }}
                >
                  Add {language}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
        <div>
          {possibleLanguages.length > 1 ? (
            <Button
              onClick={() => {
                setPossibleLanguages((prevState) => {
                  return prevState.filter(
                    (language) => language !== currentLanguageFocus
                  );
                });

                setAnswers((prevState) =>
                  prevState.map((answers) => {
                    answers.name.delete(currentLanguageFocus);
                    return answers;
                  })
                );

                setCurrentLanguageFocus(possibleLanguages.at(0)!);
              }}
              defaultButtonType="danger"
            >
              Remove {currentLanguageFocus}
            </Button>
          ) : null}
        </div>
      </div>
      <div>
        <label> Question </label>
        <input
          type="text"
          value={question.get(currentLanguageFocus) || ""}
          onChange={(e) =>
            setQuestion((prevState) => {
              prevState.set(currentLanguageFocus, e.target.value);
              return new Map(prevState);
            })
          }
        />
      </div>
      <div>
        <label> Category </label>
        <CategorySelect
          onSelect={(categoryId) => setCategoryId(categoryId)}
          defaultValue={categoryId}
        />
      </div>
      <div>
        <label>Answers</label>
        <Button
          defaultButtonType="info"
          onClick={() => {
            setAnswers((prevState) => {
              const newState = [...prevState];
              const newNameMap: QuestionAnswerType["name"] = new Map();
              possibleLanguages.forEach((language) => {
                newNameMap.set(
                  language,
                  `New ${language} answer ${prevState.length} `
                );
              });

              newState.push({ name: newNameMap });
              return newState;
            });
          }}
        >
          Add answer
        </Button>
        <div className={styles.answersWrapper}>
          {answers.map((answer, index) => {
            const currentAnswerName = new Map(answer.name).get(
              currentLanguageFocus
            );
            if (!currentAnswerName) return;
            return (
              <div key={index}>
                <input
                  type="text"
                  value={currentAnswerName}
                  onChange={(e) => {
                    setAnswers((prevState) => {
                      const newState = [...prevState];
                      const previousMap = prevState.find(
                        (v, indexAnswer) => index === indexAnswer
                      );
                      if (!previousMap) return newState;
                      previousMap.name.set(
                        currentLanguageFocus,
                        e.target.value || " "
                      );
                      newState[index] = previousMap;
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
            const { canCreate, message } = validateOnSubmitQuestion({
              possibleLanguages,
              question,
              answers,
              categoryId,
            });
            if (!canCreate) return toast.info(message);

            const answersForCreate = answers.map<QuestionCreateBodyAnswers>(
              (answer) => {
                return {
                  isCorrect: answer.isCorrect,
                  name: Array.from(answer.name.entries()),
                };
              }
            );

            const questionForCreate = Array.from(question.entries());

            onSubmit({
              question: questionForCreate,
              answers: answersForCreate,
              categoryId,
              possibleLanguages,
            });

            if (emptyAfterSubmit) {
              setQuestion(new Map());
              setAnswers([]);
              setCategoryId("");
              setPossibleLanguages([]);
            }
          }}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};
