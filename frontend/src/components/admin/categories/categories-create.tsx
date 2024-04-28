import { FC } from "react";
import { CategoriesForm } from "./categories-form";
import { fetchBackendApi } from "@/api/fetch";
import { Category } from "@/shared/types";
import { CategoryCreateBody } from "./types";

export const CategoriesCreate: FC = () => {
  return (
    <div>
      <h2>Categories create</h2>

      <CategoriesForm
        onSubmit={(name) => {
          fetchBackendApi<Category, CategoryCreateBody>({
            url: "categories/create",
            body: { name },
            notification: { pendingText: "Trying to create a category" },
            method: "POST",
          });
        }}
        submitText="Create"
        emptyAfterSubmit={true}
      />
    </div>
  );
};
