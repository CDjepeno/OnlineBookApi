export interface ErrorResponse {
  message: string;
}

export interface GetBookResponse {
  id: string;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface GetBooksResponse {
  id: string;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
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
  coverUrl: File;
}

export type AddBookFormType = {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
};

export interface UpdateBookResponse {
  id: string;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type UpdateBookFormType = {
  id: string;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList | string;
};

export type AddBookResponses = {
message : string;
}
