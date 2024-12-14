import { AxiosError, RawAxiosRequestHeaders } from "axios";
import { UseRequest } from "../../clients/axios/useRequest";
import { MethodHttpEnum } from "../../enum/enum";
import { BASE_URL } from "../route-http/route-http";

interface useApiRequestProps<T> {
  includeAuthorizationHeader: boolean;
  path: string;
  method: MethodHttpEnum;
  params?: T;
  headers?: RawAxiosRequestHeaders;
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
    console.log(error);
    if(error instanceof AxiosError && error.status === 401 ) {
      // await UseRequestApi<GetBookingsBookResponse[], { id: string }>({
      //   path: `${GET_BOOKINGS_BOOK_ROUTE}/${id}`,
      //   method: MethodHttpEnum.POST,
      //   params: { id },
      //   includeAuthorizationHeader: false,
      // })
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
