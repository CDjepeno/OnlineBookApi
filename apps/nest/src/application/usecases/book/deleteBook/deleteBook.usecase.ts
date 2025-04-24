import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { DeleteBookResponse } from './deleteBook.response';

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<DeleteBookResponse> {
    try {
      await this.repository.deleteBook(id);
      return { message: 'Le livre a bien été supprimé.' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException("Livre n'existe pas");
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }

        throw new InternalServerException(
          'Erreur interne du serveur. Impossible de supprimer le livre.',
        );
      }
    }
  }
}
