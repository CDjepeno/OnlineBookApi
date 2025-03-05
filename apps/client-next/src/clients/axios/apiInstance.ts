import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const apiInstance = (config: AxiosRequestConfig): AxiosInstance => {
  return axios.create(config);
};
