import { BookingBookRequest } from 'src/application/usecases/booking/bookingBook/bookingBook.request';
import { BookingBookResponse } from 'src/application/usecases/booking/bookingBook/bookingBook.response';
import { GetBookingsBookResponse } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.response';
import { GetBookingsUserResponse } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';

export interface BookingRepository {
  isBookReserved(bookId: number, startAt: Date, endAt: Date): Promise<boolean>;
  getBookingsDatesByBookId(bookId: number): Promise<GetBookingsBookResponse[]>;
  getBookingsUser(userId: number): Promise<GetBookingsUserResponse[]>;
  Order(bookReserved: BookingBookRequest): Promise<BookingBookResponse>;
}
