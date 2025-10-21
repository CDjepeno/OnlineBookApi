import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  TypeormException,
} from 'src/domaine/errors/onlineBook.error';
import { BookRepository } from '../../repositories/book.repository';
import {
  GetAllBookResponse,
  GetAllBookResponsePagination,
} from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(page = 1, limit = 6): Promise<GetAllBookResponsePagination> {
    try {
      const allbooks: GetAllBookResponse[] = await this.repository.getAllBook();

      const totalBooks = allbooks.length;
      const totalPages = Math.ceil(totalBooks / limit);

      const start = (page - 1) * limit;
      const paginatedBooks = allbooks.slice(start, start + limit);


      return {
        books: paginatedBooks,
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
