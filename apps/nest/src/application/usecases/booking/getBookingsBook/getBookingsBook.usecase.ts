import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { GetBookingsBookResponse } from './getBookingsBook.response';
import { HttpException } from '@nestjs/common';

export class GetBookingsBookUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(bookId: number): Promise<GetBookingsBookResponse[]> {
    try {
      return await this.getbookingBookRepository.getBookingsDatesByBookId(
        bookId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
