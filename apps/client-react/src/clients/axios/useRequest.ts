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
      ...headers,
    },
    data: params,
  };

  try {
    const response = await axiosInstance.request<TData>(config);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
    throw error;
  }
};

// if (coverUrl) {
//     if (coverUrl instanceof FileList && coverUrl.length > 0) {
//       formData.append("coverUrl", coverUrl[0]);
//     } else if (coverUrl instanceof File) {
//       formData.append("coverUrl", coverUrl);
//     } else if (typeof coverUrl === "string" && coverUrl.trim() !== "") {
//       formData.append("coverUrl", coverUrl);
//     }
//   }
