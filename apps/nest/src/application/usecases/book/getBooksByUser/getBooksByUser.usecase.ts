import { NotFoundError } from 'src/domaine/errors/book.error';
import { GetBooksByUserPaginationResponse } from './getBooksByUser.response';
import { BookRepository } from 'src/repositories/book.repository';

export class GetBooksByUserUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBooksByUserPaginationResponse> {
    try {
      return await this.repository.getBooksByUser(userId, page, limit);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des livres pour l'utilisateur :",
        error,
      );
      if (error instanceof NotFoundError) {
        throw new NotFoundError(
          `Aucun livre trouvé pour l'utilisateur avec l'ID ${userId}.`,
        );
      } else {
        throw new Error(
          `Échec de la récupération des livres pour l'utilisateur avec l'ID ${userId}. Veuillez réessayer plus tard.`,
        );
      }
    }
  }
}
