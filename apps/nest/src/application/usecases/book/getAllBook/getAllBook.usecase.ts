import { HttpException } from '@nestjs/common';
import { BookRepository } from 'src/repositories/book.repository';
import { GetAllBookResponsePagination } from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(
    page: number,
    limit: number,
  ): Promise<GetAllBookResponsePagination> {
    try {
      return await this.repository.getAllBook(page, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
