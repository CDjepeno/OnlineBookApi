import { InjectRepository } from '@nestjs/typeorm';
import { GetAllBookResponsePagination } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/application/usecases/book/getBook/getBook.response';
import { GetBookByNameResponse } from 'src/application/usecases/book/getBookByName/getBookByName.response';
import { GetBooksByUserPaginationResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { BookEntity } from 'src/domaine/entities/Book.entity';
import {
  InternalServerException,
  NotFoundException,
  TypeOrmException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookRepository } from 'src/repositories/book.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

export class BookRepositoryTypeorm implements BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addBook(addBookRequest: BookEntity): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: addBookRequest.userId },
      });

      if (!user) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      const book = new Book();
      book.title = addBookRequest.title;
      book.description = addBookRequest.description;
      book.author = addBookRequest.author;
      book.releaseAt = addBookRequest.releaseAt;
      book.coverUrl = addBookRequest.coverUrl;
      book.userId = addBookRequest.userId;

      await this.repository.save(book);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBook(
    page: number,
    limit: number,
  ): Promise<GetAllBookResponsePagination> {
    try {
      const currentPage = Math.max(0, page - 1);
      const take = limit > 0 ? limit : 10;
      const skip = currentPage * take;

      const totalBooks = await this.repository.count();

      const books = await this.repository.find({ skip, take });

      if (!books) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      return {
        books,
        pagination: {
          totalBooks,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / take),
        },
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBooksByUserPaginationResponse> {
    try {
      const currentPage = Math.max(0, page - 1);
      const take = limit > 0 ? limit : 6;
      const skip = currentPage * take;

      const totalBooks = await this.repository.count({
        where: { userId },
      });

      const books = await this.repository.find({
        where: { userId },
        take,
        skip,
        relations: ['bookings'],
      });

      if (!books) {
        throw new NotFoundException(
          `Aucun livre trouver pour l'utilisateur avec l'userId ${userId} `,
        );
      }

      const booksWithReservations = books.map((book) => ({
        ...book,
        hasFuturReservations: book.bookings.some(
          (booking) =>
            new Date(booking.startAt) > new Date() || // Réservation future
            (new Date(booking.startAt) <= new Date() &&
              new Date(booking.endAt) >= new Date()), // Réservation en cours
        ),
      }));

      return {
        books: booksWithReservations,
        pagination: {
          totalBooks,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / take),
        },
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        `Probleme serveur impossible de récupérer les livres de l'utilisateur`,
      );
    }
  }

  async getBook(id: number): Promise<GetBookResponse> {
    try {
      const book = await this.repository.findOne({
        where: { id },
      });
      if (!book) {
        throw new NotFoundException(`Aucun livre trouvé avec l'id "${id}"`);
      }
      return book;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        'Probleme serveur impossible de récupérer le livre',
      );
    }
  }

  async updateBook(id: number, book: Partial<BookEntity>): Promise<void> {
    try {
      await this.repository.update(id, book);
      const updatedBook = await this.repository.findOneBy({ id });
      if (!updatedBook) {
        throw new NotFoundException(`Aucun livre trouvé avec l'id "${id}"`);
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        'Probleme serveur impossible de modifier le livre',
      );
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBooks(ids: Array<string>): Promise<void> {
    try {
      const deletionPromises = ids.map((id) => this.repository.delete(id));

      const results = await Promise.all(deletionPromises);

      results.forEach((result) => {
        if (result.affected === 0) {
          throw new Error(ErrorsMessagesEnum.NOT_FOUND);
        }
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async getBookByName(nameBook: string): Promise<GetBookByNameResponse> {
    try {
      const book = await this.repository.findOneBy({ title: nameBook });

      if (!book) {
        throw new NotFoundException(
          `Aucun livre trouvé avec le nom "${nameBook}"`,
        );
      }
      return book;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        `Probleme serveur impossible de récupérer le livre de l'utilisateur`,
      );
    }
  }
}
