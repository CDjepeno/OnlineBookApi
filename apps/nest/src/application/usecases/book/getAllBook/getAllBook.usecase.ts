import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { GetAllBookResponse } from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(): Promise<GetAllBookResponse[]> {
    try {
      return await this.repository.getAllBook();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new InternalServerException('Aucun livre trouvé');
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données');
        }
        throw new InternalServerException(
          'Une erreur interne est survenue lors de la récupération des livres',
        );
      }
      throw new InternalServerException(
        'Erreur inconnue. Impossible de récupération des livres',
      );
    }
  }
}
