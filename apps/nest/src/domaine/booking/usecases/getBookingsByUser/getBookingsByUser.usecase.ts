import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { BookingRepository } from '../../repositories/booking.repository';
import { GetBookingsByUserResponse } from './getBookingsByUser.response';

export class GetBookingsByUserUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(userId: number): Promise<GetBookingsByUserResponse[]> {
    try {
      return await this.bookingRepository.getBookingsByUser(userId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun Livre trouvé.');
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données.');
        }
        throw new InternalServerException(
          'Une erreur interne est survenue lors de la récupération du livre.',
        );
      }
      throw new InternalServerException(
        'Erreur inconnue. Impossible de récupérer le livre.',
      );
    }
  }
}
