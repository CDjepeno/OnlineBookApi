import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { DeleteBookingsUserResponse } from './deleteBookingsUser.response';

export class DeleteBookingsUserUsecase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(id: Array<string>): Promise<DeleteBookingsUserResponse> {
    try {
      await this.bookingRepository.deleteBookings(id);
      return { msg: `Les reservations ont bien été supprimé.` };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucune reservations trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            'Probleme serveur impossible supprimer les reservations',
          );
        }
      }
      throw error;
    }
  }
}
