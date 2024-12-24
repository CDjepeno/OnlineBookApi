export interface GetBookingsBookResponse {
  startAt: string;
  endAt: string;
}

export interface BookingBookResponse {
  bookId: number;
}

export interface GetBookingUserResponse {
  bookId: number;
  name: string;
  coverUrl: string;
  startAt: string;
  endAt: string;
}
