export type AddBookForm = {
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList;
}

export type UpdateBookForm = {
  id: number;
  name: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl?: string | FileList;
};