import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/domaine/book/entities/Book.entity';
import { BookRepository } from 'src/domaine/book/repositories/book.repository';
import { GetAllBookResponse } from 'src/domaine/book/usecases/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/domaine/book/usecases/getBook/getBook.response';
import { GetBookByNameResponse } from 'src/domaine/book/usecases/getBookByName/getBookByName.response';
import { GetBooksByUserResponse } from 'src/domaine/book/usecases/getBooksByUser/getBooksByUser.response';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import { ILike, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

export class BookRepositoryTypeorm implements BookRepository {
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

  async getAllBook(
    page: number,
    limit: number,
  ): Promise<[GetAllBookResponse[], number]> {
    try {
      const [books, total] = await this.bookRepository.findAndCount({
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      return [books, total];
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]> {
    try {
      const books = await this.bookRepository.find({
        where: { userId },
        order: { id: 'DESC' },
      });

      return books;
    } catch (error) {
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
      handleDatabaseError(error);
    }
  }

  async getBookByName(name: string): Promise<GetBookByNameResponse[]> {
    try {
      const book = await this.bookRepository.find({
        where: { title: ILike(`%${name}%`) },
      });

      if (!book || book.length === 0) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      return book;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async updateBook(book: Partial<BookEntity>): Promise<void> {
    try {
      if (!book.id) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
      const existingBook = await this.bookRepository.findOneBy({ id: book.id });

      if (!existingBook) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      await this.bookRepository.update(book.id, book);
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
