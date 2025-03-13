import { HttpException } from '@nestjs/common';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<{ msg: string }> {
    try {
      await this.repository.deleteBook(id);
      return { msg: `Le livre a bien été supprimé.` };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun livre trouvé');
        }
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerException(
        "Probleme serveur impossible de supprimer le livre",
      );
    }
  }
}
