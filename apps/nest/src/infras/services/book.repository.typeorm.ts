import { InjectRepository } from '@nestjs/typeorm';
import { GetAllBookResponse } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/application/usecases/book/getBook/getBook.response';
import { GetBooksByUserResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { BookEntity } from 'src/domaine/entities/Book.entity';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

export class BookRepositoryTyperom implements BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addBook(addBookRequest: BookEntity): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: addBookRequest.userId },
      });

      if (!user) {
        throw new Error(ErrorsMessagesEnum.USER_NOT_FOUND);
      }

      const book = new Book();
      book.title = addBookRequest.title;
      book.description = addBookRequest.description;
      book.author = addBookRequest.author;
      book.releaseAt = addBookRequest.releaseAt;
      book.coverUrl = addBookRequest.coverUrl;
      book.userId = addBookRequest.userId;

      await this.bookRepository.save(book);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getAllBook(): Promise<GetAllBookResponse[]> {
    try {
      const books = await this.bookRepository.find();

      // if (books.length == 0) {
      //   throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      // }
      return books;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorsMessagesEnum.NOT_FOUND
      ) {
        throw error;
      }
      handleDatabaseError(error);
    }
  }

  async getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error(ErrorsMessagesEnum.USER_NOT_FOUND);
      }

      const books = await this.bookRepository.find({
        where: { userId },
        order: { id: 'DESC' },
      });

      return books;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorsMessagesEnum.USER_NOT_FOUND
      ) {
        throw error;
      }
      handleDatabaseError(error);
    }
  }

  async getBook(id: number): Promise<GetBookResponse> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id },
      });
      if (!book) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
      return book;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorsMessagesEnum.NOT_FOUND
      ) {
        throw error; // ← Cette ligne permet à l'erreur de remonter au UseCase
      }
      handleDatabaseError(error);
    }
  }

  async updateBook(id: number, book: Partial<BookEntity>): Promise<void> {
    try {
      await this.bookRepository.update(id, book);
      const updatedBook = await this.bookRepository.findOneBy({ id });
      if (!updatedBook) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      const result = await this.bookRepository.delete(id);
      if (result.affected === 0) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
