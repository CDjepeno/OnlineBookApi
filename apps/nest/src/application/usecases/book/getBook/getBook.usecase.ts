import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { GetBookResponse } from './getBook.response';

export class GetBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(id: number): Promise<GetBookResponse> {
    try {
      return await this.repository.getBook(id);
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
