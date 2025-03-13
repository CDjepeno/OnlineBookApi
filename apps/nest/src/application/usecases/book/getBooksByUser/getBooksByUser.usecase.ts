import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { GetBooksByUserPaginationResponse } from './getBooksByUser.response';

export class GetBooksByUserUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBooksByUserPaginationResponse> {
    try {
      return await this.repository.getBooksByUser(userId, page, limit);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun livre trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            'Probleme serveur impossible de supprimer le livre',
          );
        }
      }
      throw error;
    }
  }
}
