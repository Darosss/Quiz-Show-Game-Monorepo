"use client";

import { FC, createContext, useContext, useEffect, useState } from "react";
import { ApiDataNotNullable, ApiResponseBody } from "@/api/fetch";
import { UseFetchReturnType, useFetch } from "@/hooks/use-fetch";
import { RolesUser, UserTokenInfo } from "@/shared/index";

type ProfileResponseType = UserTokenInfo;
type ApiUser = ApiDataNotNullable<ProfileResponseType>;

type ApiStateType<ApiData, FetchResponseData, FetchBodyData = unknown> = {
  api: ApiData;
  fetchData: UseFetchReturnType<FetchResponseData, FetchBodyData>["fetchData"];
};

type ApiUserType = ApiStateType<ApiUser, ProfileResponseType>;

type AuthContextType = {
  isLoggedIn: boolean;
  apiUser: ApiUserType;
  handleLogoutUser: () => void;
  fetchUserData: () => Promise<ApiResponseBody<UserTokenInfo> | null>;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    api: userApi,
    fetchData: fetchUserData,
    clearCache,
  } = useFetch<UserTokenInfo>({
    url: "auth/profile",
    method: "GET",
  });

  const handleLogoutUser = () => {
    clearCache();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setIsLoggedIn(!!userApi.responseData.data);
  }, [userApi.responseData.data]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        apiUser: {
          api: userApi.responseData.data
            ? (userApi.responseData as ApiUser)
            : defaultApiUserData,
          fetchData: fetchUserData,
        },
        handleLogoutUser,
        fetchUserData,
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
