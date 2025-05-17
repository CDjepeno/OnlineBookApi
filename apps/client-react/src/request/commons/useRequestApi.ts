import axios, { RawAxiosRequestHeaders } from "axios";
import { UseRequest } from "../../clients/axios/useRequest";
import { MethodHttpEnum } from "../../enum/enum";
import { BASE_URL } from "../route-http/route-http";

interface useApiRequestProps<T> {
  path: string;
  method: MethodHttpEnum;
  includeAuthorizationHeader: boolean;
  headers?: RawAxiosRequestHeaders;
  params?: T;
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
    const parsedObject = storedValue ? JSON.parse(storedValue) : null;

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
    handleRequestError(error);
    throw error;
  }
}

function handleRequestError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Une erreur Axios s'est produite", error.message);
    if (error.response) {
      console.error("Données de la réponse:", error.response.data);
    }
  } else if (error instanceof Error) {
    console.error("Une erreur inattendue s'est produite:", error.message);
  } else {
    console.error("Erreur inconnue", error);
  }
}
