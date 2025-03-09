export type AddBookForm = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File;
}


export type UpdateBookForm = {
  id?: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl?: string | File;
};

export interface BookFormData {
  id?: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: File | string;
}