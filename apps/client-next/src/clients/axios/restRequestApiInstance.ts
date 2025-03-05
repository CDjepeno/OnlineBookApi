import { RawAxiosRequestHeaders } from "axios";
import { apiInstance } from "./apiInstance";

export const restRequestApiInstance = (
  baseURL: string,
  headers?: RawAxiosRequestHeaders
) =>
  apiInstance({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
