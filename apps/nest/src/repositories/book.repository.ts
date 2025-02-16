import { AddBookResponse } from 'src/application/usecases/book/addBook/addBook.response';
import { GetAllBookResponse } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/application/usecases/book/getBook/getBook.response';
import { GetBooksByUserResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { UpdateBookResponse } from 'src/application/usecases/book/updateBook/updateBook.response';
import { BookEntity } from '../domaine/entities/Book.entity';

export interface BookRepository {
  addBook(book: BookEntity): Promise<AddBookResponse>;
  getAllBook(): Promise<GetAllBookResponse[]>;
  getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]>;
  getBook(id: number): Promise<GetBookResponse>;
  updateBook(
    id: number,
    book: Partial<BookEntity>,
  ): Promise<UpdateBookResponse>;
  deleteBook(id: number): Promise<void>;
}
