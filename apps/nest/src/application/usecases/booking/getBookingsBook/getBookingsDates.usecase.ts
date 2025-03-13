import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { GetBookingsDatesByBookResponse } from './getBookingsBook.response';

export class GetBookingsDatesByBookUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(bookId: number): Promise<GetBookingsDatesByBookResponse[]> {
    try {
      return await this.getbookingBookRepository.getBookingsDatesByBookId(
        bookId,
      );
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
            'Probleme serveur impossible recuperer les reservations',
          );
        }
      }
      throw error;
    }
  }
}
