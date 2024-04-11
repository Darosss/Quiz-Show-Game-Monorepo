import { LoginForm } from "@/components/auth";
import styles from "./login.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.loginPageWrapper}>
      <LoginForm />
    </div>
  );
}
