"use client";

import styles from "./register-form.module.scss";
import { FC, FormEvent } from "react";
import { fetchBackendApi } from "@/api/fetch";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common";
import { User } from "@/shared/types";

type LoginResponse = User;

type LoginFetchBody = {
  username: string;
  password: string;
};

export const RegisterForm: FC = () => {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    if (!username || !password) return;

    await fetchBackendApi<LoginResponse, LoginFetchBody>({
      url: "auth/register",
      method: "POST",
      body: {
        username: `${username}`,
        password: `${password}`,
      },
      notification: { pendingText: "Trying to register. Please wait" },
    }).then((response) => {
      const data = response?.data;
      if (!data) return;

      router.push("login");
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
          Register
        </Button>
      </div>
    </form>
  );
};
