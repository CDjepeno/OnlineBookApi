import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { GetBooksByUserResponse } from './getBooksByUser.response';

export class GetBooksByUserUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(userId: number): Promise<GetBooksByUserResponse[]> {
    try {
      return await this.repository.getBooksByUser(userId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException(
            `Aucun livre trouvé pour l'utilisateur avec l'ID ${userId}.`,
          );
        }

        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données.');
        }
        throw new InternalServerException(
          "Une erreur interne est survenue lors de la récupération des livres pour l'utilisateur.",
        );
      }
      throw new InternalServerException(
        'Erreur inconnue. Impossible de récupérer des livres.',
      );
    }
  }
}
