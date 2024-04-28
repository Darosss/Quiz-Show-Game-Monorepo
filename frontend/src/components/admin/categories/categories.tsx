"use client";

import { FC, useMemo, useState } from "react";
import styles from "../admin.module.scss";
import { CategoriesList } from "./categories-list";
import { CategoriesEdit } from "./categories-edit";
import { CategoriesCreate } from "./categories-create";
import { Button } from "@/components/common";
import { Category } from "@/shared/types";

enum CurrentView {
  LIST = "Categories list",
  EDIT = "Edit",
  CREATE = "Create",
}

export const CategoriesMenu: FC = () => {
  const [currentView, setCurrentView] = useState<CurrentView>(CurrentView.LIST);
  //NOTE: editingCategories state temporary solution xpp
  //TODO: improve
  const [editingCategories, setEditingCategories] = useState<Category>();
  const currentViewComponent = useMemo(() => {
    switch (currentView) {
      case CurrentView.LIST:
        return (
          <CategoriesList
            onEdit={(category) => {
              setEditingCategories(category);
              setCurrentView(CurrentView.EDIT);
            }}
          />
        );
      case CurrentView.EDIT:
        return editingCategories ? (
          <CategoriesEdit data={editingCategories} />
        ) : null;
      case CurrentView.CREATE:
        return <CategoriesCreate />;
      default:
        return null;
    }
  }, [currentView, editingCategories]);

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.menuButtonsWrapper}>
        {Object.entries(CurrentView).map(([name, id]) => (
          <Button
            key={id}
            defaultButtonType={`${id === currentView ? "success" : "primary"}`}
            onClick={() => setCurrentView(id)}
          >
            {name}
          </Button>
        ))}
      </div>
      {currentViewComponent ? (
        <div className={styles.currentViewWrapper}>{currentViewComponent}</div>
      ) : null}
    </div>
  );
};
