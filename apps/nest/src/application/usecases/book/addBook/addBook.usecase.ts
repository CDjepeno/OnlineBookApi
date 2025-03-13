import { HttpException } from '@nestjs/common';
import { BookEntity } from 'src/domaine/entities/Book.entity';
import { InternalServerException, NotFoundException } from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import { BookRepository } from 'src/repositories/book.repository';
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
        request.id!,
        request.title,
        request.description,
        request.author,
        request.releaseAt,
        coverUrl,
        request.userId,
      );
      await this.bookRepository.addBook(book);

      return { msg: 'Votre livre a bien été créé' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Utilisateur non trouvé');
        }
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerException(
        "Probleme serveur impossible d'ajouter l'utilisateur",
      );
    }
  }
}
