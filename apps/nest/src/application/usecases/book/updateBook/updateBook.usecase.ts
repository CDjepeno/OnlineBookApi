import { BookEntity } from 'src/domaine/entities/Book.entity';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import { BookRepository } from 'src/repositories/book.repository';
import { UpdateBookRequest } from './updateBook.request';
import { UpdateBookResponse } from './updateBook.response';

export class UpdateBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly awsS3Client: AwsS3Client,
  ) {}

  async execute(request: UpdateBookRequest): Promise<UpdateBookResponse> {
    try {
      const existingBook = await this.bookRepository.getBook(request.id);

      if (!existingBook) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      let coverUrl = existingBook.coverUrl;
      if (request.coverUrl) {
        coverUrl = await this.awsS3Client.uploadFile(request.coverUrl);
      }

      const updatedBook = new BookEntity(
        request.id,
        request.title ?? existingBook.title,
        request.description ?? existingBook.description,
        request.author ?? existingBook.author,
        request.releaseAt ?? existingBook.releaseAt,
        coverUrl,
        request.userId,
      );

      await this.bookRepository.updateBook(request.id, updatedBook);

      return { message: 'Votre livre a bien été mis à jour' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Livre introuvable.');
        }

        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur de base de données.');
        }

        throw new InternalServerException(
          'Une erreur interne est survenue lors de la mise à jour du livre.',
        );
      }

      throw new InternalServerException(
        'Erreur inconnue. Impossible de mettre à jour le livre.',
      );
    }
  }
}
