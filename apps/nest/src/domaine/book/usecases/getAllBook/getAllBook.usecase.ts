import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  TypeormException,
} from 'src/domaine/errors/onlineBook.error';
import { BookRepository } from '../../repositories/book.repository';
import { GetAllBookResponsePagination } from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(page = 1, limit = 6): Promise<GetAllBookResponsePagination> {
    try {
      const [books, totalBooks] = await this.repository.getAllBook(page, limit);

      const totalPages = Math.ceil(totalBooks / limit);

      return {
        books,
        meta: {
          totalBooks,
          currentPage: page,
          totalPages,
        },
      };
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
