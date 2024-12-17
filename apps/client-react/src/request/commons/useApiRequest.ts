import { AxiosError, RawAxiosRequestHeaders } from "axios";
import { UseRequest } from "../../clients/axios/useRequest";
import { MethodHttpEnum } from "../../enum/enum";
import { RefreshTokenResponse } from "../../types/user/response.types";
import { BASE_URL, REFRESH_TOKEN_ROUTE } from "../route-http/route-http";

interface useApiRequestProps<T> {
  includeAuthorizationHeader: boolean;
  path: string;
  method: MethodHttpEnum;
  params?: T;
  headers?: RawAxiosRequestHeaders;
}

type RefreshRequest = {
  refreshToken: string | null;
};

function safeParseJSON<T>(value: string | null): T | null {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

export async function UseRequestApi<TData, T>({
  path,
  method,
  includeAuthorizationHeader = true,
  headers,
  params,
}: useApiRequestProps<T>): Promise<TData> {
  try {
    const storedValue = localStorage.getItem("BookToken");
    const parsedObject = safeParseJSON<string>(storedValue);

    const headersApiNest = {
      Accept: "application/json",
      ...(includeAuthorizationHeader &&
        parsedObject && {
          Authorization: `Bearer ${parsedObject}`,
        }),
      ...headers,
    };

    const response = await UseRequest<TData, T>(
      BASE_URL,
      path,
      method,
      headersApiNest,
      params
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 401) {
      try {
        const refreshToken: RefreshRequest = {
          refreshToken: localStorage.getItem("RefreshToken"),
        };
        const parsedRefreshToken = safeParseJSON<string>(refreshToken.refreshToken);

        const headersRefresh = {
          Accept: "application/json",
        };

        const result = await UseRequest<RefreshTokenResponse, RefreshRequest>(
          BASE_URL,
          REFRESH_TOKEN_ROUTE,
          MethodHttpEnum.POST,
          headersRefresh,
          {refreshToken: parsedRefreshToken}
        );
        
        localStorage.setItem("BookToken", JSON.stringify(result.token));
        localStorage.setItem(
          "RefreshToken",
          JSON.stringify(result.refreshToken)
        );

        const headersRetry = {
          Accept: "application/json",
          Authorization: `Bearer ${result.token}`,
          ...headers,
        };

        const retryResponse = await UseRequest<TData, T>(
          BASE_URL,
          path,
          method,
          headersRetry,
          params
        );

        return retryResponse;
            
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        handleRequestError(refreshError);
        throw refreshError; 
      }
    }
    handleRequestError(error);
    throw error;
  }
}

function handleRequestError(error: unknown) {
  if (error instanceof Error) {
    console.error("An unexpected error occurred:", error.message);
  } else if (isAxiosError(error)) {
    console.error("An Axios error occurred:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return !!(error as AxiosError).isAxiosError !== undefined;
}
