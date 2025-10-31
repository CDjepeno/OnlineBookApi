
import { NotFoundException } from 'src/domaine/errors/onlineBook.error';
import { BookingRepository } from '../../repositories/booking.repository';
import { GetBookingsByUserIdResponse } from './getBookingsByUser.response';

export class GetBookingsByUserUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(userId: number): Promise<GetBookingsByUserIdResponse[]> {
    const bookings = await this.bookingRepository.getBookingsByUser(userId);

    console.log('bookingsss => ', bookings);


    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(
        `Aucune réservation trouvée pour l'utilisateur ${userId}`,
      );
    }

    const results: GetBookingsByUserIdResponse[] = [];

    for (const {booking, book}  of bookings) {
      console.log('booking => ', booking);
      const bookBookings = await this.bookingRepository.findBookingsByBookId(
        booking.bookId,
      );

      const hasFutureReservation = bookBookings.some(
        (b) => b.startAt > booking.endAt,
      );

      results.push({
        bookingId: booking.id,
        bookId: booking.bookId,
        title: book.title,
        coverUrl: book.coverUrl,
        startAt: booking.startAt,
        endAt: booking.endAt,
        hasFutureReservation,
      });
    }
    return results;
  }
}
