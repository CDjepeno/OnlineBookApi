import { NotFoundException } from 'src/domaine/errors/onlineBook.error';
import { BookingRepository } from '../../repositories/booking.repository';
import { GetBookingDatesByBookIdRequest } from './getBookingDatesByBookId.request';
import { GetBookingDatesByBookIdResponse } from './getBookingDatesByBookId.response';

export class GetBookingDatesByBookIdUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(
    request: GetBookingDatesByBookIdRequest,
  ): Promise<GetBookingDatesByBookIdResponse[]> {
    const { bookId } = request;

    const bookings = await this.bookingRepository.findBookingsByBookId(bookId);

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(
        `Aucune réservation trouvée pour le livre avec l'ID ${bookId}`,
      );
    }

    return bookings.map((b) => ({
      id: b.id,
      startAt: b.startAt,
      endAt: b.endAt,
      userId: b.userId,
    }));
  }
}
