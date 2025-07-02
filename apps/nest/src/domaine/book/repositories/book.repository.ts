import { BookEntity } from '../entities/Book.entity';
import { GetAllBookResponse } from '../usecases/getAllBook/getAllBook.response';
import { GetBookResponse } from '../usecases/getBook/getBook.response';
import { GetBooksByUserResponse } from '../usecases/getBooksByUser/getBooksByUser.response';

export interface BookRepository {
  addBook(book: BookEntity): Promise<void>;
  getAllBook(): Promise<GetAllBookResponse[]>;
  getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]>;
  getBook(id: number): Promise<GetBookResponse>;
  updateBook(id: number, book: Partial<BookEntity>): Promise<void>;
  deleteBook(id: number): Promise<void>;
}
