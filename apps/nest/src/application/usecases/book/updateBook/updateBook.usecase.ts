import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookEntity } from 'src/domaine/entities/Book.entity';
import { NotFoundError } from 'src/domaine/errors/book.error';
import { BookRepository } from 'src/domaine/repositories/book.repository';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
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
        throw new NotFoundError(`Livre avec l'ID ${request.id} introuvable.`);
      }

      let coverUrl = existingBook.coverUrl;

      if (typeof request.coverUrl === `object`) {
        coverUrl = await this.awsS3Client.uploadFile(request.coverUrl);
      }

      const updatedBook = new BookEntity(
        request.id,
        request.name ?? existingBook.name,
        request.description ?? existingBook.description,
        request.author ?? existingBook.author,
        request.releaseAt ?? existingBook.releaseAt,
        coverUrl,
        request.userId!,
      );

      const res = await this.bookRepository.updateBook(request.id, updatedBook);

      return res;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('internal server error');
    }
  }
}
