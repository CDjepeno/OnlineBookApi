import { BookRepository } from 'src/domaine/repositories/book.repository';
import { GetBookResponse } from './getBook.response';

export class GetBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(id: number): Promise<GetBookResponse> {
    return await this.repository.getBook(id);
  }
}
