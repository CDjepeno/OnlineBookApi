import { HttpException } from '@nestjs/common';
import { BookRepository } from 'src/repositories/book.repository';

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<{ msg: string }> {
    try {
      await this.repository.deleteBook(id);
      return { msg: `Le livre a bien été supprimé.` };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
