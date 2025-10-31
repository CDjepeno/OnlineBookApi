export class GetBookingsByUserIdResponse {
  bookingId: number;
  bookId: number;
  title: string;
  coverUrl: string;
  startAt: Date;
  endAt: Date;
  hasFutureReservation: boolean;
}
