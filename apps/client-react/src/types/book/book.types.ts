export interface BookResponse {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type GetBookResponse = BookResponse;

export type GetBooksResponse = BookResponse;

export type AddBookResponse = BookResponse;


export interface AddBookInput {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
}

export interface AddBookFormType {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
}

export type UpdateBookResponse = BookResponse;

export type UpdateBookFormType = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File | string;
};

export type AddBookResponses = {
  message: string;
};

export interface ErrorResponse {
  message: string;
}
