"use client";

import { FC, useMemo, useState } from "react";
import styles from "../admin.module.scss";
import { QuestionsList } from "./questions-list";
import { QuestionEdit } from "./question-edit";
import { QuestionCreate } from "./question-create";
import { Button } from "@/components/common";
import { Question } from "@/shared/types";

enum CurrentView {
  LIST = "Questions list",
  EDIT = "Edit",
  CREATE = "Create",
}

export const QuestionsMenu: FC = () => {
  const [currentView, setCurrentView] = useState<CurrentView>(CurrentView.LIST);
  //NOTE: editingQuestion state temporary solution xpp
  //TODO: improve
  const [editingQuestion, setEditingQuestion] = useState<Question>();
  const currentViewComponent = useMemo(() => {
    switch (currentView) {
      case CurrentView.LIST:
        return (
          <QuestionsList
            onEdit={(question) => {
              setEditingQuestion(question);
              setCurrentView(CurrentView.EDIT);
            }}
          />
        );
      case CurrentView.EDIT:
        return editingQuestion ? <QuestionEdit data={editingQuestion} /> : null;
      case CurrentView.CREATE:
        return <QuestionCreate />;
      default:
        return null;
    }
  }, [currentView, editingQuestion]);

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
