export type BookingBookRequest = {
  id?: number,
  email?: string,
  name?: string,
  title?: string,
  bookId: number,
  userId: number,
  createdAt: Date,
  startAt: Date,
  endAt: Date
}