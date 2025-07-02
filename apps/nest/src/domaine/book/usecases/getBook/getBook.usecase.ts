import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { GetBookResponse } from './getBook.response';
import { BookRepository } from '../../repositories/book.repository';

export class GetBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<GetBookResponse> {
    if (!id || id <= 0 || !Number.isInteger(id)) {
      throw new BadRequestException('ID du livre invalide');
    }
    try {
      return await this.repository.getBook(id);
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
