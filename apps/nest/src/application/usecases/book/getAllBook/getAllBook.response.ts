export type GetAllBookResponse = {
  id?: number;
  name: string;
  description: string;
  author: string;
  releaseAt: Date;
  coverUrl: string;
  created_at?: Date;
  update_at?: Date;
  booking?: string;
}

export type GetAllBookResponsePagination = {
    books: GetAllBookResponse[],
    pagination: {
      totalBooks: number,
      currentPage: number,
      totalPages: number,
    },
}
