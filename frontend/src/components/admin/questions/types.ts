import { QuestionAnswerType } from "@/shared/types";

export type QuestionAnswerTypeForm = Pick<
  QuestionAnswerType,
  "isCorrect" | "name"
>;

export type QuestionCreateBody = {
  question: string;
  answers: QuestionAnswerTypeForm[];
  categoryId: string;
};

export type QuestionUpdateBody = Partial<QuestionCreateBody>;
