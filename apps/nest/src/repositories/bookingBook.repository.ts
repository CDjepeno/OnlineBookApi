import { BookingBookRequest } from 'src/application/usecases/booking/bookingBook/bookingBook.request';
import { BookingBookResponse } from 'src/application/usecases/booking/bookingBook/bookingBook.response';
import { GetBookingsBookResponse } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.response';
import { GetBookingUserPaginationResponse } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';

export interface BookingRepository {
  isBookReserved(bookId: number, startAt: Date, endAt: Date): Promise<boolean>;
  getBookingsDatesByBookId(bookId: number): Promise<GetBookingsBookResponse[]>;
  getBookingsUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBookingUserPaginationResponse>;
  Order(bookReserved: BookingBookRequest): Promise<BookingBookResponse>;
}
