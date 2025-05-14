"use client";

import styles from "./login-form.module.scss";
import { FC, FormEvent } from "react";
import { fetchBackendApi } from "@/api/fetch";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common";
import { useAuthContext } from "./auth-context";

type LoginResponse = {
  expTimestamp: number;
};

type LoginFetchBody = {
  username: string;
  password: string;
};

export const LoginForm: FC = () => {
  const router = useRouter();
  const { fetchUserData } = useAuthContext();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    if (!username || !password) return;

    await fetchBackendApi<LoginResponse, LoginFetchBody>({
      url: "auth/login",
      method: "POST",
      body: { username: `${username}`, password: `${password}` },
      notification: { pendingText: "Trying to log in. Please wait" },
    }).then((response) => {
      const data = response?.message;
      if (!data) return;
      fetchUserData();

      router.replace("/");
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>Username</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" required />
      </div>
      <div>
        <Button type="submit" defaultButtonType="primary">
          Login
        </Button>
      </div>
    </form>
  );
};
