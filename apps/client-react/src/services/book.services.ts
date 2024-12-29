import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import { BOOKS_ROUTE, BOOK_ROUTE } from "../request/route-http/route-http";
import {
  AddBookResponse,
  GetAllBookResponsePagination,
  GetBookResponse,
  GetBooksResponse,
  UpdateBookResponse,
} from "../types/book/book.types";

export const getBooks = async (page: number, limit: number): Promise<GetAllBookResponsePagination> => {
  return await UseRequestApi<GetAllBookResponsePagination, null>({
    path: `${BOOKS_ROUTE}?page=${page}?limit=${limit}`,
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

export const getBookByName = async (nameBook: string): Promise<GetBookResponse> => {
  return await UseRequestApi<GetBookResponse, { nameBook: string }>({
    path: `${BOOK_ROUTE}?name=${nameBook}`,
    method: MethodHttpEnum.GET,
    includeAuthorizationHeader: false,
  });
};

export const getBooksByUser = async (
  id: string
): Promise<GetBooksResponse[]> => {
  return await UseRequestApi<GetBooksResponse[], { id: string }>({
    path: `${BOOKS_ROUTE}/${id}`,
    method: MethodHttpEnum.GET,
    params: { id },
    includeAuthorizationHeader: false,
  });
};

export const createBook = async (
  formData: FormData,
  userId: number | null
): Promise<AddBookResponse> => {
  if (userId) {
    formData.append("userId", userId.toString());
  }

  return await UseRequestApi<AddBookResponse, FormData>({
    method: MethodHttpEnum.POST,
    path: BOOK_ROUTE,
    params: formData,
    includeAuthorizationHeader: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  await UseRequestApi({
    method: MethodHttpEnum.DELETE,
    path: `${BOOK_ROUTE}/${id}`,
    params: { id },
    includeAuthorizationHeader: true,
  });
};

export const updateBook = async (
  id: number,
  data: FormData | Record<string, unknown> 
): Promise<UpdateBookResponse> => {
  const isFormdata = data instanceof FormData
  return await UseRequestApi({
    method: MethodHttpEnum.PUT,
    path: `${BOOK_ROUTE}/${id}`,
    params: data,
    includeAuthorizationHeader: true,
    headers: {
      "Content-Type": isFormdata ? "multipart/form-data" : "application/json",
    },
  });
};

