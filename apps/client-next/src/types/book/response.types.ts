export type UpdateBookResponse = {
  msg: string;
}

export type ErrorResponse = {
  message: string;
}

export type GetBookResponse = {
  id: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type DeleteBooksResponse = {
  msg: string;
}

export type DeleteBookResponse = {
  msg: string;
}

export type GetBooksResponse = {
  id: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
  userId?: number;
  created_At?: string;
  updated_At?: string;
  hasFuturReservations?: boolean;

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

export type AddBookResponse = {
  msg: string;
}
