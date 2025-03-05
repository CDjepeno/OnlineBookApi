import { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { MethodHttpEnum } from "../../enum/enum";
import { restRequestApiInstance } from "./restRequestApiInstance";

export const UseRequest = async <TData, T>(
  baseURL: string,
  path: string,
  method: MethodHttpEnum,
  headers?: RawAxiosRequestHeaders,
  params?: T
): Promise<TData> => {
  const axiosInstance = restRequestApiInstance(baseURL, headers);

  const config: AxiosRequestConfig = {
    method,
    url: path,
    headers: {
      "Content-Type":
        params instanceof FormData ? "multipart/form-data" : "application/json",
      ...headers,
    },
    data: params,
  };

  try {
    const response = await axiosInstance.request<TData>(config);
    return response.data;
  } catch (error) {
    console.error("Error making request:", error);
    throw error;
  }
};
