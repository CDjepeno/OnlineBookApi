import { AddBookResponse } from 'src/application/usecases/book/addBook/addBook.response';
import { GetAllBookResponsePagination } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/application/usecases/book/getBook/getBook.response';
import { GetBookByNameResponse } from 'src/application/usecases/book/getBookByName/getBookByName.response';
import { GetBooksByUserPaginationResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { UpdateBookResponse } from 'src/application/usecases/book/updateBook/updateBook.response';
import { BookEntity } from '../entities/Book.entity';

export interface BookRepository {
  addBook(book: BookEntity): Promise<AddBookResponse>;
  getAllBook(
    page: number,
    limit: number,
  ): Promise<GetAllBookResponsePagination>;
  getBooksByUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBooksByUserPaginationResponse>;
  getBook(id: number): Promise<GetBookResponse>;
  getBookByName(nameBook: string): Promise<GetBookByNameResponse>;
  updateBook(
    id: number,
    book: Partial<BookEntity>,
  ): Promise<UpdateBookResponse>;
  deleteBook(id: number): Promise<void>;
}
