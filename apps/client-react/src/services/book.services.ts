import { AxiosResponse } from "axios";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useRequestApi";
import { BOOKS_ROUTE, BOOK_ROUTE } from "../request/route-http/route-http";
import {
  AddBookResponses,
  GetBookResponse,
  GetBooksResponse,
  UpdateBookResponses,
} from "../types/book/book.types";

export const getBooks = async (): Promise<GetBooksResponse[]> => {
  return await UseRequestApi<GetBooksResponse[], null>({
    path: BOOKS_ROUTE,
    method: MethodHttpEnum.GET,
    includeAuthorizationHeader: false,
  });
};

export const getBook = async (id: string): Promise<GetBookResponse> => {
  return await UseRequestApi<GetBookResponse, { id: string }>({
    path: `${BOOK_ROUTE}/${id}`,
    method: MethodHttpEnum.GET,
    params: { id },
    includeAuthorizationHeader: false,
  });
};

export const getBooksByUser = async (): Promise<GetBooksResponse[]> => {
  return await UseRequestApi<GetBooksResponse[], { userId: string }>({
    path: BOOKS_ROUTE,
    method: MethodHttpEnum.GET,
    includeAuthorizationHeader: false,
  });
};

export const createBook = async (
  formData: FormData,
  userId: number | null
): Promise<AddBookResponses> => {
  if (userId) {
    formData.append("userId", userId.toString());
  }

  const response: AxiosResponse = await UseRequestApi({
    method: MethodHttpEnum.POST,
    path: BOOK_ROUTE,
    params: formData,
    includeAuthorizationHeader: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateBook = async (
  id: number,
  data: FormData | Record<string, unknown>
): Promise<UpdateBookResponses> => {
  const response: AxiosResponse = await UseRequestApi({
    method: MethodHttpEnum.PUT,
    path: `${BOOK_ROUTE}/${id}`,
    params: data,
    includeAuthorizationHeader: true,
  });

  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await UseRequestApi({
    method: MethodHttpEnum.DELETE,
    path: `${BOOK_ROUTE}/${id}`,
    params: { id },
    includeAuthorizationHeader: false,
  });
};
