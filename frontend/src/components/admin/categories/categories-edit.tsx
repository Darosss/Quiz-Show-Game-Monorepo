import { FC } from "react";
import { CategoriesForm } from "./categories-form";
import { fetchBackendApi } from "@/api/fetch";
import { Category } from "@/shared/types";
import { CategoryUpdateBody } from "./types";

type CategoriesEditProps = {
  data: Category;
};

export const CategoriesEdit: FC<CategoriesEditProps> = ({ data }) => {
  return (
    <div>
      <h2>Categories edit </h2>

      <CategoriesForm
        data={data}
        submitText="Edit"
        onSubmit={(name) => {
          fetchBackendApi<Category, CategoryUpdateBody>({
            url: `categories/${data._id}`,
            body: { name },
            notification: { pendingText: "Trying to update a category" },
            method: "PATCH",
          });
        }}
      />
    </div>
  );
};
