import { BookingEntity } from '../entities/booking.entity';
import { AddBookingResponse } from '../usecases/addBooking.response';

export interface BookingRepository {
  createBooking(booking: BookingEntity): Promise<AddBookingResponse>;
  findOverlappingBookings(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<BookingEntity[]>;
}
