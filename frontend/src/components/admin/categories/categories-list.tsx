import { FC } from "react";
import { Button, FetchingInfo } from "@/components/common";
import { useFetch } from "@/hooks/use-fetch";
import { Category } from "@/shared/types";
import styles from "./categories.module.scss";
import { PossibleLanguages } from "@/shared/enums";

type CategoriesListProps = {
  onEdit: (category: Category) => void;
};

export const CategoriesList: FC<CategoriesListProps> = ({ onEdit }) => {
  const {
    api: { isPending, error, responseData },
  } = useFetch<Category[]>({
    url: "categories",
    method: "GET",
  });
  if (!responseData.data || error || isPending)
    return <FetchingInfo isPending={isPending} error={error} />;

  return (
    <div className={styles.categoriesListWrapper}>
      <h2> Categories list</h2>

      <div>
        <div>Category name</div>

        {responseData.data.map((category) => {
          return (
            <div key={category._id} className={styles.categoriesListData}>
              {/* TODO: add here to show only from user preference or button */}
              <div>{Object.values(category.name).at(0)}</div>
              <div>
                <Button
                  defaultButtonType="info"
                  onClick={() => onEdit(category)}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
