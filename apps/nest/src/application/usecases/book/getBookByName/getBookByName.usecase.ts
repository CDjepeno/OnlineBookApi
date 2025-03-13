import { HttpException } from '@nestjs/common';
import { BookRepository } from 'src/repositories/book.repository';
import { GetBookByNameResponse } from './getBookByName.response';

export class GetBookByNameUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(nameBook: string): Promise<GetBookByNameResponse> {
    try {
      return await this.repository.getBookByName(nameBook);
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
