import { BookRepository } from 'src/repositories/book.repository';
import { GetBookResponse } from './getBook.response';

export class GetBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(id: number): Promise<GetBookResponse> {
    try {
      return await this.repository.getBook(id);
    } catch (error) {
      throw error;
    }
  }
}
