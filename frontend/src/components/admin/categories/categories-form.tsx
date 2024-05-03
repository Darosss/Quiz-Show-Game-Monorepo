import { Button } from "@/components/common";
import { Category } from "@/shared/types";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import styles from "./categories.module.scss";
import { PossibleLanguages } from "@/shared/enums";
import { CategoryCreateBody } from "./types";
import { validateOnSubmitCategory } from "./categories-form-validation";

type CategoriesFormProps = {
  onSubmit: (data: CategoryCreateBody) => void;
  submitText: string;
  data?: Category;
  emptyAfterSubmit?: boolean;
};

export const CategoriesForm: FC<CategoriesFormProps> = ({
  onSubmit,
  submitText,
  data,
  emptyAfterSubmit,
}) => {
  const [name, setName] = useState(
    data?.name
      ? (new Map(Object.entries(data.name)) as Map<PossibleLanguages, string>)
      : new Map<PossibleLanguages, string>()
  );

  return (
    <div className={styles.categoryFormWrapper}>
      <div>
        <label> Categories </label>
        {Object.values(PossibleLanguages).map((language) => (
          <div key={language}>
            <label>{language} </label>
            <input
              type="text"
              value={name.get(language) || ""}
              onChange={(e) =>
                setName((prevState) => {
                  const newState = new Map(prevState);

                  newState.set(language, e.target.value);

                  return newState;
                })
              }
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          defaultButtonType="primary"
          onClick={() => {
            const { canCreate, message } = validateOnSubmitCategory({
              name,
            });
            if (!canCreate) return toast.info(message);
            if (emptyAfterSubmit) {
              setName(new Map());
            }

            const namesForCreate = Array.from(name.entries());
            onSubmit({ name: namesForCreate });
          }}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};
