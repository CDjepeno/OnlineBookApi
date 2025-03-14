import { BookingBookRequest } from 'src/application/usecases/booking/bookingBook/bookingBook.request';
import { GetBookingsDatesByBookResponse } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.response';
import { GetBookingUserPaginationResponse } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';
import { UpdateBookingUserRequest } from 'src/application/usecases/booking/updateBooking/updateBookingUser.request';

export interface BookingRepository {
  isBookReserved(bookId: number, startAt: Date, endAt: Date): Promise<boolean>;
  getBookingsDatesByBookId(bookId: number): Promise<GetBookingsDatesByBookResponse[]>;
  getBookingsUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBookingUserPaginationResponse>;
  Order(bookReserved: BookingBookRequest): Promise<void>;
  updateBookingUser(updateBooking: UpdateBookingUserRequest): Promise<void>;
  deleteBooking(id: number): Promise<void>;
  deleteBookings(id: Array<string>): Promise<void>;
}
