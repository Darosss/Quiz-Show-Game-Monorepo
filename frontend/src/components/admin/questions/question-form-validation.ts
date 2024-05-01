import { Question } from "@/shared/types";
import { QuestionAnswerTypeForm } from "./types";

type ValidateOnSubmitQuestionData = {
  possibleLanguages: Question["possibleLanguages"];
  question: Question["question"];
  answers: QuestionAnswerTypeForm[];
  categoryId: string;
};

export type ValidateOnSubmitQuestionReturn = {
  canCreate: boolean;
  message?: string;
};

export const validateOnSubmitQuestion = ({
  possibleLanguages,
  question,
  answers,
  categoryId,
}: ValidateOnSubmitQuestionData): ValidateOnSubmitQuestionReturn => {
  const questionNotFilled = possibleLanguages.some(
    (language) => !question.get(language)
  );
  const returnData: ValidateOnSubmitQuestionReturn = { canCreate: false };

  if (questionNotFilled) {
    returnData.message = "In every languages question must be provided";
    return returnData;
  }
  if (answers.length < 2) {
    returnData.message = "There need to be at least 2 answers";
    return returnData;
  }

  const someAnswersArentFilled = answers.some((answer) =>
    Array.from(answer.name).some((answerName) => !answerName[1].trim())
  );

  if (someAnswersArentFilled) {
    returnData.message = "Fill every answer or remove empty";
    return returnData;
  }
  if (!categoryId) {
    returnData.message = "You need to set a category";
    return returnData;
  }
  if (possibleLanguages.length <= 0) {
    returnData.message = "You need to set at least one possible language";
    return returnData;
  }

  returnData.canCreate = true;
  return returnData;
};
