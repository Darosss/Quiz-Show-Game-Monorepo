import { FC } from "react";
import styles from "./admin.module.scss";
import Link from "next/link";

export const AdminMenu: FC = () => {
  return (
    <div className={styles.adminMenuWrapper}>
      <Link href="admin/questions"> Questions</Link>
      <Link href="admin/categories"> Categories </Link>

      <div> Others (soon) </div>
    </div>
  );
};
