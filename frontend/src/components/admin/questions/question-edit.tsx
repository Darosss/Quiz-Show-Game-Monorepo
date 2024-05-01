import { Question } from "@/shared/types";
import { FC } from "react";
import { QuestionForm } from "./question-form";
import { QuestionUpdateBody } from "./types";
import { fetchBackendApi } from "@/api/fetch";
import { PossibleLanguages } from "@/shared/enums";

type QuestionEditProps = {
  data: Question;
  onSuccessEdit: () => void;
};

export const QuestionEdit: FC<QuestionEditProps> = ({
  data: { answers, ...restData },
  onSuccessEdit,
}) => {
  return (
    <div>
      <h2>Question edit </h2>

      <QuestionForm
        data={{
          ...restData,
          answers: answers.map(({ name, ...rest }) => ({
            ...rest,
            name: new Map(Object.entries(name)) as Map<
              PossibleLanguages,
              string
            >,
          })),
        }}
        submitText="Edit"
        onSubmit={(bodyData) => {
          fetchBackendApi<Question, QuestionUpdateBody>({
            url: `questions/${restData._id}`,
            body: bodyData,
            notification: { pendingText: "Trying to update a question" },
            method: "PATCH",
          }).then((response) => (response.data ? onSuccessEdit() : null));
        }}
      />
    </div>
  );
};
