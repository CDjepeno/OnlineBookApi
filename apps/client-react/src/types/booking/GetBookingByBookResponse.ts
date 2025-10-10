export type GetBookingByBookResponse = {
  id: number;
  startAt: string;
  endAt: string;
  userId: number;
};

export interface AddBookingInput {
  bookId: string;
  startAt: string;
  endAt: string;
}
