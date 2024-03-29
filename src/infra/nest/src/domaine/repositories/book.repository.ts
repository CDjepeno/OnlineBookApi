import { AddBookResponse } from 'src/application/usecases/book/AddBook/add.book.response';
import { Book } from '../entities/Book.entity';

export interface BookRepository {
  addBook(book: Book): Promise<AddBookResponse>;
}
