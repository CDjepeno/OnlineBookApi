export type BookingBookFormType = {
  bookId: number,
  userId: number,
  startAt: string,
  endAt: string,
  title: string,
  name: string
  email: string
};

export type UpdateBookingUserFormType = {
  id: number,
  startAt: string,
  endAt: string,
};

