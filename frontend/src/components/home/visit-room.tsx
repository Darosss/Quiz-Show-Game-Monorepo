import { FC } from "react";
import { Button } from "@/components/common";
import styles from "./home-content.module.scss";
import { useRouter } from "next/navigation";

export const VisitRoom: FC = () => {
  const router = useRouter();
  return (
    <div className={styles.visitRoomWrapper}>
      <h2> Looks like you are already in a room go check it out!</h2>
      <Button onClick={() => router.push("/game")}>Visit room </Button>
    </div>
  );
};
