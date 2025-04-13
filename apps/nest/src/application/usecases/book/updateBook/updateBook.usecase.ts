import { BookEntity } from 'src/domaine/entities/Book.entity';
import { NotFoundError } from 'src/domaine/errors/onlineBook.error';
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
        throw new NotFoundError(`Livre avec l'ID ${request.id} introuvable.`);
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
      throw new Error(error);
    }
  }
}
