export type BookResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type GetBookResponse = BookResponse;

export type GetBooksResponse = BookResponse;

export type AddBookResponse = BookResponse;

export type UpdateBookResponse = BookResponse;

export type AddBookInput = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
};

export type AddBookFormType = AddBookInput;

export type UpdateBookFormType = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File | string;
};

export type ApiResponse = {
  message: string;
};

export type AddBookResponses = ApiResponse;

export type UpdateBookResponses = ApiResponse;

export type DeleteBookResponses = ApiResponse;

export type ErrorResponse = {
  message: string;
};
