import { MethodHttpEnum } from "@/types/enum/enum";
import { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { restRequestApiInstance } from "./restRequestApiInstance";

export const UseRequest = async <TData, T>(
  baseURL: string,
  path: string,
  method: MethodHttpEnum,
  headers?: RawAxiosRequestHeaders,
  params?: T,
  token?: string
): Promise<TData> => {
  const axiosInstance = restRequestApiInstance(baseURL, headers);

  // Configurer les en-têtes de la requête
  const config: AxiosRequestConfig = {
    method,
    url: path,
    headers: {
      "Content-Type":
        params instanceof FormData ? "multipart/form-data" : "application/json",
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }), // Ajouter Bearer token s'il est présent
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
