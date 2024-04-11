"use client";

import Cookies from "js-cookie";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { ApiDataNotNullable, COOKIE_TOKEN_NAME } from "@/api/fetch";
import { UseFetchReturnType, useFetch } from "@/hooks/useFetch";
import { UserTokenInfo } from "@/api/types";

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
  },
  message: "",
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<AuthContextProps> = ({ children }) => {
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
    setIsLoggedIn(!!Cookies.get(COOKIE_TOKEN_NAME));
  }, []);

  useEffect(() => {
    isLoggedIn ? fetchUserData() : clearCache();
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
