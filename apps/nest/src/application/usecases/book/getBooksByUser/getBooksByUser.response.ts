// Book {
//   id: 11,
//   name: 'maria',
//   description: 'marfna ldssa',
//   author: 'le llivre',
//   releaseAt: 2024-12-30T23:00:00.000Z,
//   coverUrl: 'https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/0a48dcf8-f37c-4a18-9bb8-a309e4633140-ubuntu-orange.jpeg',
//   userId: 12,
//   created_at: 2024-12-30T16:36:28.749Z,
//   updated_at: 2024-12-30T16:36:28.749Z
// }

export type GetBooksByUserResponse = {
  id?: number;
  name: string;
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
