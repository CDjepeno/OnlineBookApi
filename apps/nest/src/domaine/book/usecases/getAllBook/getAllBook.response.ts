export class GetAllBookResponse {
  id?: number;
  title: string;
  description: string;
  author: string;
  releaseAt: Date;
  coverUrl: string;
  created_at?: Date;
  update_at?: Date;
}


export type GetAllBookResponsePagination = {
  books: GetAllBookResponse[],
  meta: {
    totalBooks: number,
    currentPage: number,
    totalPages: number,
  },
}