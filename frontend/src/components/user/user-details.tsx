import { FC } from "react";
import { useAuthContext } from "@/components/auth";
import styles from "./user-details.module.scss";
export const UserDetails: FC = () => {
  const {
    apiUser: {
      api: { data },
    },
  } = useAuthContext();
  return (
    <div className={styles.userDetailsWrapper}>
      <div>Username: {data.username}</div>
      <div>Your roles: {data.roles.join(" | ")}</div>
    </div>
  );
};
