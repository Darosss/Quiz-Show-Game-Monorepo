import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BASE_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const COOKIE_TOKEN_NAME = "auth-token-quiz-show-backend";

export type ApiResponseBody<DataType> = {
  data: DataType | null;
  message: string | null;
};

export type ApiDataNotNullable<DataType> = {
  data: DataType;
  message: string | null;
};

export type ApiError = {
  httpStatus: string;
  message: string;
};

export type MethodType = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type NotificationOptions = {
  pendingText: string;
};

export type FetchBackendApiParams<BodyType = unknown> = {
  url: string;
  method?: MethodType;
  body?: BodyType;
  notification?: NotificationOptions;
};

export const fetchBackendApi = async <ResponseT, BodyT = unknown>({
  url,
  method = "GET",
  body,
  notification,
}: FetchBackendApiParams<BodyT>) => {
  const authToken = Cookies.get(COOKIE_TOKEN_NAME);

  const headers = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  const toastId = notification
    ? toast.loading(notification.pendingText, {
        autoClose: 30000,
        closeOnClick: true,
      })
    : null;
  return fetch(BASE_BACKEND_URL + url, {
    method: !method ? "GET" : method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(async (response) => {
      const json = await response.json();
      if (!response.ok) {
        const jsonAsError = json as ApiError;
        throw new Error(jsonAsError.message);
      }
      const jsonAsResponseData = json as ApiResponseBody<ResponseT>;

      toastId
        ? toast.update(toastId, {
            render: jsonAsResponseData.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          })
        : null;

      return jsonAsResponseData;
    })
    .catch((error) => {
      toastId
        ? toast.update(toastId, {
            render: error.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          })
        : null;
      throw error;
    });
};
