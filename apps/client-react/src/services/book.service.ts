import { AxiosResponse } from "axios";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useRequestApi";
import {
  BOOK_ROUTE,
  BOOK_SEARCH_ROUTE,
  BOOKS_ROUTE,
} from "../request/route-http/route-http";
import {
  AddBookResponses,
  DeleteBookResponses,
  GetAllBooksPaginationResponse,
  GetBookResponse,
  GetBooksByUserResponse,
  GetBooksResponse,
  UpdateBookResponses,
} from "../types/book/book.types";

export const getBooks = async (
  page = 1,
  limit = 6
): Promise<GetAllBooksPaginationResponse> => {
  return await UseRequestApi<
    GetAllBooksPaginationResponse,
    { page: string; limit: string }
  >({
    path: `${BOOKS_ROUTE}?page=${page}&limit=${limit}`,
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

export const getBooksByUser = async (
  userId: string
): Promise<GetBooksByUserResponse[]> => {
  return await UseRequestApi<GetBooksByUserResponse[], { userId: string }>({
    path: `${BOOKS_ROUTE}/${userId}`,
    method: MethodHttpEnum.GET,
    includeAuthorizationHeader: true,
  });
};

export const getBookByName = async (
  name: string
): Promise<GetBooksResponse[]> => {
  return await UseRequestApi<GetBooksResponse[], { title: string }>({
    path: `${BOOK_SEARCH_ROUTE}?name=${encodeURIComponent(name)}`,
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

export const deleteBook = async (id: string): Promise<DeleteBookResponses> => {
  const response = await UseRequestApi<DeleteBookResponses, { id: string }>({
    method: MethodHttpEnum.DELETE,
    path: `${BOOK_ROUTE}/${id}`,
    params: { id },
    includeAuthorizationHeader: true,
  });
  return response;
};
