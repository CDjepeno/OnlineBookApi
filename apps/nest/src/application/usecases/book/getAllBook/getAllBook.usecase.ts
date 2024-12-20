import { BookRepository } from 'src/domaine/repositories/book.repository';
import { GetAllBookResponsePagination } from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(
    page: number,
    limit: number,
  ): Promise<GetAllBookResponsePagination> {
    return await this.repository.getAllBook(page, limit);
  }
}
