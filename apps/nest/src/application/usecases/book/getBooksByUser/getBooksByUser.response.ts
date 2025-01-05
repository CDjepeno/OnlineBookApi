
export type GetBooksByUserResponse = {
  id?: number;
  title: string;
  description: string;
  author: string;
  releaseAt: Date;
  coverUrl: string;
  userId: number;
  created_at?: Date;
  update_at?: Date;
};

export type GetBooksByUserPaginationResponse = {
  books: GetBooksByUserResponse[];
  pagination: {
    totalBooks: number;
    currentPage: number;
    totalPages: number;
  };
};
