import { PossibleLanguages } from "@/shared/enums";
import { Category } from "@/shared/types";

type ValidateOnSubmitQuestionData = {
  name: Category["name"];
};

export type ValidateOnSubmitQuestionReturn = {
  canCreate: boolean;
  message?: string;
};

export const validateOnSubmitCategory = ({
  name,
}: ValidateOnSubmitQuestionData): ValidateOnSubmitQuestionReturn => {
  const nameNotFilled = Object.values(PossibleLanguages).some((language) => {
    console.log(name.get(language));
    return !name.get(language);
  });
  const returnData: ValidateOnSubmitQuestionReturn = { canCreate: false };

  if (nameNotFilled) {
    returnData.message = "In every languages category name must be provided";
    return returnData;
  }
  returnData.canCreate = true;
  return returnData;
};
