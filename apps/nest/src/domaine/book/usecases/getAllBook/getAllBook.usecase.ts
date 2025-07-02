import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  TypeormException,
} from 'src/domaine/errors/onlineBook.error';
import { GetAllBookResponse } from './getAllBook.response';
import { BookRepository } from '../../repositories/book.repository';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(): Promise<GetAllBookResponse[]> {
    try {
      return await this.repository.getAllBook();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new TypeormException('Erreur de base de données');
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
