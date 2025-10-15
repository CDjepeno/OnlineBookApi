import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { BookRepository } from '../../repositories/book.repository';
import { GetBooksByNameResponse } from './getBooksByName.response';

export class GetBooksByNameUsecase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(name: string): Promise<GetBooksByNameResponse[]> {
    try {
      return this.bookRepository.getBooksByName(name);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun Livre trouvé.');
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données.');
        }
        throw new InternalServerException(
          'Une erreur interne est survenue lors de la récupération du livre.',
        );
      }
      throw new InternalServerException(
        'Erreur inconnue. Impossible de récupérer le livre.',
      );
    }
  }
}
