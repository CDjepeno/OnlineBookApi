import { NotFoundException } from 'src/domaine/errors/onlineBook.error';
import { BookingRepository } from '../../repositories/booking.repository';
import { GetBookingsByUserResponse } from './getBookingsByUser.response';

export class GetBookingsByUserUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(userId: number): Promise<GetBookingsByUserResponse[]> {
    const bookings = await this.bookingRepository.getBookingsByUser(userId);

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(
        `Aucune réservation trouvée pour l'utilisateur ${userId}`,
      );
    }

    return bookings;
  }
}
