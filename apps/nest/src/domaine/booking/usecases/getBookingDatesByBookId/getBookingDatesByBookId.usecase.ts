import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { BookingRepository } from '../../repositories/booking.repository';
import { GetBookingDatesByBookIdRequest } from './getBookingDatesByBookId.request';
import { GetBookingDatesByBookIdResponse } from './getBookingDatesByBookId.response';

export class GetBookingDatesByBookIdUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(
    request: GetBookingDatesByBookIdRequest,
  ): Promise<GetBookingDatesByBookIdResponse[]> {
    try {
      return await this.bookingRepository.findBookingsByBookId(request.bookId);
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
