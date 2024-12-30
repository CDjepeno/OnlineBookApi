export type UpdateBookResponse = {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type ErrorResponse = {
  message: string;
}

export interface GetBookResponse {
  id: number;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface GetBooksResponse {
  id: number;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type GetAllBookResponsePagination = {
  books: GetBooksResponse[],
  meta: {
    totalBooks: number,
    currentPage: number,
    totalPages: number,
  },
}

export interface AddBookResponse {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}
