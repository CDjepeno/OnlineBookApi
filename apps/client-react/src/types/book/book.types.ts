export interface ErrorResponse {
  message: string;
}

export interface GetBookResponse {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface GetBooksResponse {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface AddBookResponse {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export interface AddBookInput {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
}

export type AddBookFormType = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
};

export interface UpdateBookResponse {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string;
}

export type UpdateBookFormType = {
  id: string;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList | string;
};

export type AddBookResponses = {
message : string;
}
