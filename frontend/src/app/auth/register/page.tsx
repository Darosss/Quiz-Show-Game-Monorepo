import { RegisterForm } from "@/components/auth";
import styles from "./register.module.scss";

export default async function Register() {
  return (
    <div className={styles.registerPageWrapper}>
      <RegisterForm />
    </div>
  );
}
