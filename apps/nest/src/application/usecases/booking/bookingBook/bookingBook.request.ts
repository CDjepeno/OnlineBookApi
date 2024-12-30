export type BookingBookRequest = {
  id?: number,
  bookId: number,
  userId: number,
  createdAt: Date,
  startAt: Date,
  endAt: Date
}