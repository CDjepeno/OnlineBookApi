export interface ErrorResponse {
  message: string;
}

export interface GetBookByNameInput {
  name: string;
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

export interface AddBookInput {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList;
}

export type AddBookFormType = {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList;
};


export interface UpdateBookResponse {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type UpdateBookFormType = {
  id: number;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl?: string | FileList;
};
