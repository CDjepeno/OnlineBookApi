import { BookingEntity } from '../entities/booking.entity';
import { AddBookingResponse } from '../usecases/addBooking/addBooking.response';
import { GetBookingsByUserResponse } from '../usecases/getBookingsByUser/getBookingsByUser.response';

export interface BookingRepository {
  createBooking(booking: BookingEntity): Promise<AddBookingResponse>;
  findOverlappingBookings(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<BookingEntity[]>;
  findBookingsByBookId(bookId: number): Promise<BookingEntity[]>;
  getBookingsByUser(userId: number): Promise<GetBookingsByUserResponse[]>;
}
