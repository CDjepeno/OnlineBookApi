import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { DeleteBookResponse } from './deleteBook.response';
import { BookRepository } from '../../repositories/book.repository';

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<DeleteBookResponse> {
    try {
      await this.repository.deleteBook(id);
      return { message: 'Le livre a bien été supprimé.' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException("Livre n'existe pas");
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de la base de donnees');
        }

        throw new InternalServerException(
          'Erreur interne du serveur. Impossible de supprimer le livre.',
        );
      }
    }
  }
}
