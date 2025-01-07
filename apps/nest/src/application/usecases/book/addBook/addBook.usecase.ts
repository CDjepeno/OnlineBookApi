import { BookEntity } from 'src/domaine/entities/Book.entity';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import { AddBookRequest } from './addBook.request';
import { AddBookResponse } from './addBook.response';
import { BookRepository } from 'src/repositories/book.repository';

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
      const res = await this.bookRepository.addBook(book);

      return res;
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      throw new Error("internal server error");
    }
  }
}
