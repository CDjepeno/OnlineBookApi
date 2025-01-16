export type GetBookingsBookResponse = {
  startAt: string;
  endAt: string;
}

export type BookingBookResponse = {
  msg: string;
}

export type GetBookingUserResponse = {
  bookingId: number;
  bookId: number;
  title: string;
  coverUrl: string;
  startAt: string;
  endAt: string;
  hasFuturReservations: boolean;
}

export type GetBookingUserPaginationResponse = {
  bookings: GetBookingUserResponse[],
    pagination: {
      totalBooks: number,
      currentPage: number,
      totalPages: number,
    },
}

export type UpdateBookingUserResponse = {
  msg: string;
}

export type DeleteBookingUserResponse = {
  msg: string;
}

export type DeleteBookingsUserResponse = {
  msg: string;
}
