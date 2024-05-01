import { PossibleLanguages } from "@/shared/enums";
import { QuestionAnswerType } from "@/shared/types";

export type QuestionAnswerTypeForm = Pick<
  QuestionAnswerType,
  "isCorrect" | "name"
>;

export type QuestionCreateBodyAnswers = Pick<
  QuestionAnswerType,
  "isCorrect"
> & {
  name: string[][];
};

export type QuestionNameTypeForm = Map<PossibleLanguages, string>;

export type QuestionCreateBody = {
  question: string[][];
  answers: QuestionCreateBodyAnswers[];
  categoryId: string;
  possibleLanguages: PossibleLanguages[];
};

export type QuestionUpdateBody = Partial<QuestionCreateBody>;
