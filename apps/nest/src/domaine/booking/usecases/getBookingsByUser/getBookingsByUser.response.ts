export type GetBookingsByUserResponse = {
  bookingId: number;
  bookId: number;
  title: string;
  coverUrl: string;
  startAt: Date;
  endAt: Date;
  hasFutureReservation: boolean;
}
