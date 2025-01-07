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
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface GetBooksResponse {
  id: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
  userId: number;
  created_At: string;
  updated_At: string;
  hasFuturReservations: boolean;

}

export type GetAllBookResponsePagination = {
  books: GetBooksResponse[],
  pagination: {
    totalBooks: number,
    currentPage: number,
    totalPages: number,
  },
}

export type GetBookByUserPaginationResponse = {
  books: GetBooksResponse[],
  pagination: {
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
