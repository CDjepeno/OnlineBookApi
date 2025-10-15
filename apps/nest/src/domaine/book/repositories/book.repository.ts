import { BookEntity } from '../entities/Book.entity';
import { GetAllBookResponse } from '../usecases/getAllBook/getAllBook.response';
import { GetBookResponse } from '../usecases/getBook/getBook.response';
import { GetBooksByNameResponse } from '../usecases/getBooksByName/getBooksByName.response';
import { GetBooksByUserResponse } from '../usecases/getBooksByUser/getBooksByUser.response';

export interface BookRepository {
  addBook(book: BookEntity): Promise<void>;
  getAllBook(): Promise<GetAllBookResponse[]>;
  getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]>;
  getBook(id: number): Promise<GetBookResponse>;
  updateBook(book: Partial<BookEntity>): Promise<void>;
  deleteBook(id: number): Promise<void>;
  getBooksByName(name: string): Promise<GetBooksByNameResponse[]>;
}
