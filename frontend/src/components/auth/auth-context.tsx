"use client";

import Cookies from "js-cookie";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { ApiDataNotNullable, COOKIE_TOKEN_NAME } from "@/api/fetch";
import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { RolesUser, UserTokenInfo } from "@/shared/index";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ProfileResponseType = UserTokenInfo;
type ApiUser = ApiDataNotNullable<ProfileResponseType>;

type ApiStateType<ApiData, FetchResponseData, FetchBodyData = unknown> = {
  api: ApiData;
  fetchData: UseFetchReturnType<FetchResponseData, FetchBodyData>["fetchData"];
};

type ApiUserType = ApiStateType<ApiUser, ProfileResponseType>;

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  apiUser: ApiUserType;
};

type AuthContextProps = {
  children: React.ReactNode;
};

const defaultApiUserData: ApiUser = {
  data: {
    exp: 0,
    iat: 0,
    sub: "",
    username: "",
    roles: [RolesUser.User],
  },
  message: "",
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<AuthContextProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const authCookie = Cookies.get(COOKIE_TOKEN_NAME);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    api: userApi,
    fetchData: fetchUserData,
    clearCache,
  } = useFetch<ProfileResponseType>(
    {
      url: "auth/profile",
      method: "GET",
    },
    { manual: true }
  );
  useEffect(() => {
    setIsLoggedIn(!!authCookie);
  }, [authCookie]);

  useEffect(() => {
    if (!authCookie && !isLoggedIn && pathname !== "/auth/login") {
      clearCache();
      toast.info("Log in to visit that site");
      router.replace("/auth/login");
    } else {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, fetchUserData, isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        apiUser: {
          api: userApi.responseData.data
            ? (userApi.responseData as ApiUser)
            : defaultApiUserData,
          fetchData: fetchUserData,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): Required<AuthContextType> => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return authContext as AuthContextType;
};
