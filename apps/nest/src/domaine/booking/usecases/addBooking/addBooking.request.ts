export type AddBookingRequest = {
  startAt: Date;
  endAt: Date;
  userId: number;
  bookId: number;
}