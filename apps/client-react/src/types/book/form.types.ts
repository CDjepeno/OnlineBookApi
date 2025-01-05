export type AddBookForm = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList;
}

export type BookForm = {
  id?: number;
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl?: string | FileList;
};