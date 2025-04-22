import { BookRepository } from 'src/repositories/book.repository';
import { GetBookResponse } from './getBook.response';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { InternalServerException, NotFoundException } from 'src/domaine/errors/onlineBook.error';

export class GetBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(id: number): Promise<GetBookResponse> {

    try {
      return await this.repository.getBook(id);
    } catch (error) {
      if(error instanceof Error) {
        if(error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun Livre trouvé');
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données.');
        }
        throw new InternalServerException(
          "Une erreur interne est survenue lors de la récupération du livre.",
        );
      }
      throw new InternalServerException('Erreur inconnue. Impossible de récupérer le livre.');
    }
  }
}
