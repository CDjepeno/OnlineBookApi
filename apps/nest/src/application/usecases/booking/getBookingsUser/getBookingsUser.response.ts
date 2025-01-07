export type GetBookingUserResponse = {
  BookId: number;
  title: string;
  coverUrl: string;
  startAt: string;
  endAt: string;
};

export type GetBookingUserPaginationResponse = {
  bookings: GetBookingUserResponse[];
  pagination: {
    totalBookings: number;
    currentPage: number;
    totalPages: number;
  };
};
