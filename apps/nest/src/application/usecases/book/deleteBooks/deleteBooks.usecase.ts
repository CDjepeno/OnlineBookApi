import { HttpException } from '@nestjs/common';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';

export class DeleteBooksUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(ids: Array<string>): Promise<{ msg: string }> {
    try {
      await this.repository.deleteBooks(ids);
      return { msg: 'Les livres ont bien été supprimer' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun livre trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            'Probleme serveur impossible de supprimer le livre',
          );
        }
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw error
    }
  }
}
