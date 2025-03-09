export type GetBookByNameInput = {
  title: string;
}

export type AddBookInput = {
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: FileList;
}

export type UpdateBookInput = {
  id?: number
  title: string;
  description: string;
  author: string;
  releaseAt: string;
  coverUrl: string | File;
}





