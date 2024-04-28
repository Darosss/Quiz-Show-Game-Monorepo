import { FC } from "react";
import { QuestionForm } from "./question-form";
import { fetchBackendApi } from "@/api/fetch";
import { Question } from "@/shared/types";
import { QuestionCreateBody } from "./types";

export const QuestionCreate: FC = () => {
  return (
    <div>
      <h2>Question create</h2>

      <QuestionForm
        onSubmit={(data) => {
          fetchBackendApi<Question, QuestionCreateBody>({
            url: "questions/create",
            body: data,
            notification: { pendingText: "Trying to create a question" },
            method: "POST",
          });
        }}
        submitText="Create"
        emptyAfterSubmit={true}
      />
    </div>
  );
};
