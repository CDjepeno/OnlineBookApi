import { HttpException } from '@nestjs/common';
import { BookRepository } from 'src/repositories/book.repository';

export class DeleteBooksUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(ids: Array<string>): Promise<{ msg: string }> {
    try {
      await this.repository.deleteBooks(ids);
      return { msg: 'Les livres ont bien été supprimer' };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
