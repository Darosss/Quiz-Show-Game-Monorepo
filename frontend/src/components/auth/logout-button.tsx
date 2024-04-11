import Cookies from "js-cookie";
import { Button } from "@/components/common";
import { COOKIE_TOKEN_NAME } from "@/api/fetch";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./auth-context";
import { FC } from "react";

export const LogoutButton: FC = () => {
  const { setIsLoggedIn } = useAuthContext();
  const router = useRouter();
  const handleOnLogout = () => {
    Cookies.remove(COOKIE_TOKEN_NAME);

    setIsLoggedIn(false);
    router.replace("/auth/login");
  };

  return (
    <Button defaultButtonType="danger" onClick={handleOnLogout}>
      Logout
    </Button>
  );
};
