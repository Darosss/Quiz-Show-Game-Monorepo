import { Button } from "@/components/common";
import { Category } from "@/shared/types";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import styles from "./categories.module.scss";

type CategoriesFormProps = {
  onSubmit: (name: string) => void;
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
  const [name, setName] = useState(data?.name || "");
  return (
    <div className={styles.categoryFormWrapper}>
      <div>
        <label> Categories </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Button
          defaultButtonType="primary"
          onClick={() => {
            if (!name) return toast.info("Category name must be provided");
            if (emptyAfterSubmit) {
              setName("");
            }

            onSubmit(name);
          }}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};
