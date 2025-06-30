import { BookEntity } from 'src/domaine/entities/Book.entity';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  ConflictException,
  InternalServerException,
} from 'src/domaine/errors/onlineBook.error';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import { BookRepository } from '../../../../repositories/book.repository';
import { AddBookRequest } from './addBook.request';
import { AddBookResponse } from './addBook.response';
export class AddBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly awsS3Client: AwsS3Client,
  ) {}

  async execute(request: AddBookRequest): Promise<AddBookResponse> {
    try {
      const coverUrl = await this.awsS3Client.uploadFile(request.coverUrl);

      const book = new BookEntity(
        request.id,
        request.title,
        request.description,
        request.author,
        request.releaseAt,
        coverUrl,
        request.userId,
      );
      await this.bookRepository.addBook(book);

      return { message: 'Votre livre a bien été créé ' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DUPLICATE_BOOK) {
          throw new ConflictException('Un livre avec ce titre existe déjà');
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données');
        }
        throw new InternalServerException(
          "Une erreur interne est survenue lors de l'ajout du livre",
        );
      }

      throw new InternalServerException(
        'Erreur inconnue. Impossible de créer le livre.',
      );
    }
  }
}
