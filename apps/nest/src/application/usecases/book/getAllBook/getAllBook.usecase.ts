import { BookRepository } from 'src/repositories/book.repository';
import { GetAllBookResponse } from './getAllBook.response';

export class GetAllBookUsecase {
  constructor(private readonly repository: BookRepository) {}
  async execute(): Promise<GetAllBookResponse[]> {
    return await this.repository.getAllBook();
  }
}
