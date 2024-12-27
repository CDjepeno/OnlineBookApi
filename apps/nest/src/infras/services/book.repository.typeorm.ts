import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddBookResponse } from 'src/application/usecases/book/addBook/addBook.response';
import { GetAllBookResponsePagination } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { GetBookResponse } from 'src/application/usecases/book/getBook/getBook.response';
import { GetBookByNameResponse } from 'src/application/usecases/book/getBookByName/getBookByName.response';
import { GetBooksByUserResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { UpdateBookResponse } from 'src/application/usecases/book/updateBook/updateBook.response';
import { BookEntity } from 'src/domaine/entities/Book.entity';
import { BookRepository } from 'src/domaine/repositories/book.repository';
import { Repository } from 'typeorm';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

export class BookRepositoryTypeorm implements BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addBook(addBookRequest: BookEntity): Promise<AddBookResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: addBookRequest.userId },
      });

      if (!user) {
        throw new NotFoundException("L'utilisateur n'existe pas.");
      }

      const book = new Book();
      book.name = addBookRequest.name;
      book.description = addBookRequest.description;
      book.author = addBookRequest.author;
      book.releaseAt = addBookRequest.releaseAt;
      book.coverUrl = addBookRequest.coverUrl;
      book.userId = addBookRequest.userId;

      const result = await this.repository.save(book);
      const { name, description, author, releaseAt, coverUrl } = result;
      return {
        name,
        description,
        author,
        releaseAt,
        coverUrl,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      throw new InternalServerErrorException("Impossible d'ajouter le livre.");
    }
  }

  async getAllBook(
    page: number,
    limit: number,
  ): Promise<GetAllBookResponsePagination> {
    try {
      const currentPage = Math.max(0, page - 1);
      const take = limit > 0 ? limit : 6;
      const skip = currentPage * take;

      const totalBooks = await this.repository.count();

      const books = await this.repository.find({ skip, take });

      return {
        books,
        meta: {
          totalBooks,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / take),
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des livres :', error);
      throw new InternalServerErrorException(
        'Impossible de récupérer les livres.',
      );
    }
  }

  async getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]> {
    try {
      const books = this.repository.find({
        where: { userId },
      });
      if (!books) {
        throw new NotFoundException(
          `Aucun livre trouve pour l'utilisateur avec l'userId ${userId} `,
        );
      }
      return books;
    } catch (error) {
      console.error(
        "Erreur s'est produite lors de la récupération des livres",
        error,
      );
    }
  }

  async getBook(id: number): Promise<GetBookResponse> {
    try {
      console.log(`Recherche de livres avec l'id : ${id}`);
      const book = await this.repository.findOne({
        where: { id },
      });
      if (!book) {
        throw new NotFoundException(`Aucun livre trouvé avec l'id "${id}"`);
      }
      return book;
    } catch (error) {
      console.error("Erreur lors de la recherche d'un livre :", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Impossible de récupérer le livre.',
      );
    }
  }

  async updateBook(
    id: number,
    book: Partial<BookEntity>,
  ): Promise<UpdateBookResponse> {
    try {
      await this.repository.update(id, book);
      const updatedBook = await this.repository.findOneBy({ id });
      if (!updatedBook) {
        throw new NotFoundException(`Aucun livre trouvé avec l'id "${id}"`);
      }
      return updatedBook;
    } catch (error) {
      console.error("Erreur lors de la modification d'un livre :", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Impossible de modifier le livre.',
      );
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Aucun livre trouvé avec l'id "${id}"`);
      }
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Impossible de supprimer le livre.',
      );
    }
  }

  async getBookByName(nameBook: string): Promise<GetBookByNameResponse> {
    try {
      const book = await this.repository.findOneBy({ name: nameBook });

      if (!book) {
        throw new NotFoundException(
          `Aucun livre trouvé avec le nom "${nameBook}"`,
        );
      }
      return book;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Impossible de supprimer le livre.',
      );
    }
  }
}
