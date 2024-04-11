"use client";
import { FC } from "react";
import styles from "./home-content.module.scss";
import { BaseRoomActions } from "@/components/rooms";

export const HomeContent: FC = () => {
  return (
    <div className={styles.homeContentWrapper}>
      <div className={styles.homeViewContent}>
        <BaseRoomActions />
      </div>
    </div>
  );
};
