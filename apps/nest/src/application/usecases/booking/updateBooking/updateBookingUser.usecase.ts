import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { UpdateBookingUserRequest } from './updateBookingUser.request';
import { UpdateBookingUserResponse } from './updateBookingUser.response';

export class UpdateBookingUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(
    upddaBookingRequest: UpdateBookingUserRequest,
  ): Promise<UpdateBookingUserResponse> {
    try {
      await this.getbookingBookRepository.updateBookingUser(
        upddaBookingRequest,
      );
      return { msg: 'votre reservation a bien été modifier' };
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
            'Probleme serveur impossible de modifier la reservation',
          );
        }
      }
      throw error;
    }
  }
}
