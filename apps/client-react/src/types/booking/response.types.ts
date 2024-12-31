export type GetBookingsBookResponse = {
  startAt: string;
  endAt: string;
}

export type BookingBookResponse = {
  bookId: number;
}

export type GetBookingUserResponse = {
  bookId: number;
  name: string;
  coverUrl: string;
  startAt: string;
  endAt: string;
}

export type GetBookingUserPaginationResponse = {
  bookings: GetBookingUserResponse[],
    pagination: {
      totalBooks: number,
      currentPage: number,
      totalPages: number,
    },
}
