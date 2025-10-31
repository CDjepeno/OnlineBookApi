import { BookEntity } from 'src/domaine/book/entities/Book.entity';
import { BookingEntity } from '../entities/booking.entity';
import { AddBookingResponse } from '../usecases/addBooking/addBooking.response';

export interface BookingRepository {
  createBooking(booking: BookingEntity): Promise<AddBookingResponse>;
  findOverlappingBookings(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<BookingEntity[]>;
  findBookingsByBookId(bookId: number): Promise<BookingEntity[]>;
  getBookingsByUser(
    userId: number,
  ): Promise<{ booking: BookingEntity; book: BookEntity }[]>;
}
