import { FC } from "react";
import { CategoriesForm } from "./categories-form";
import { fetchBackendApi } from "@/api/fetch";
import { Category } from "@/shared/types";
import { CategoryUpdateBody } from "./types";

type CategoriesEditProps = {
  data: Category;
  onSuccessEdit: () => void;
};

export const CategoriesEdit: FC<CategoriesEditProps> = ({
  data,
  onSuccessEdit,
}) => {
  return (
    <div>
      <h2>Categories edit </h2>

      <CategoriesForm
        data={data}
        submitText="Edit"
        onSubmit={(bodyData) => {
          fetchBackendApi<Category, CategoryUpdateBody>({
            url: `categories/${data._id}`,
            body: bodyData,
            notification: { pendingText: "Trying to update a category" },
            method: "PATCH",
          }).then((response) => (response.data ? onSuccessEdit() : null));
        }}
      />
    </div>
  );
};
