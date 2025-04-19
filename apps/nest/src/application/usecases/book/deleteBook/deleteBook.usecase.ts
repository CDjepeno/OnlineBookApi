import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<string> {
    try {
      await this.repository.deleteBook(id);
      return `Le livre avec l'id ${id} a bien été supprimé.`;
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
