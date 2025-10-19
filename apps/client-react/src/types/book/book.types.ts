export type GetBookResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type GetBooksResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type GetBooksByUserResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type AddBookResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type UpdateBookResponse = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
};

export type AddBookInput = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
};

export type AddBookFormType = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
};

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

export type UpdateBookResponses = {
  message: string;
};

export type DeleteBookResponses = {
  message: string;
};

export type ErrorResponse = {
  message: string;
};
export type SearchFormType = { search: string };
