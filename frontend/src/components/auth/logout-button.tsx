import { fetchBackendApi } from "@/api/fetch";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useAuthContext } from "./auth-context";

export const LogoutButton: FC = () => {
  const { handleLogoutUser } = useAuthContext();
  const router = useRouter();
  const handleOnLogout = async () => {
    await fetchBackendApi<undefined>({
      url: `auth/logout`,
      method: "POST",
      notification: { pendingText: "Trying to logout. Please wait" },
    }).then((response) => {
      const data = response.message;
      if (!data) return;
      handleLogoutUser();
      router.replace("/auth/login");
    });
  };

  return (
    <Button defaultButtonType="danger" onClick={handleOnLogout}>
      Logout
    </Button>
  );
};
