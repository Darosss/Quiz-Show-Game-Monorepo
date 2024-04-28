import { Question } from "@/shared/types";
import { FC } from "react";
import { QuestionForm } from "./question-form";
import { QuestionUpdateBody } from "./types";
import { fetchBackendApi } from "@/api/fetch";

type QuestionEditProps = {
  data: Question;
};

export const QuestionEdit: FC<QuestionEditProps> = ({ data }) => {
  return (
    <div>
      <h2>Question edit </h2>

      <QuestionForm
        data={data}
        submitText="Edit"
        onSubmit={(bodyData) => {
          fetchBackendApi<Question, QuestionUpdateBody>({
            url: `questions/${data._id}`,
            body: bodyData,
            notification: { pendingText: "Trying to update a question" },
            method: "PATCH",
          });
        }}
      />
    </div>
  );
};
