import { BadRequestException, ConflictException } from '@nestjs/common';
import { GetBookingsBookResponse } from './getBookingsBook.response';
import { BookingRepository } from 'src/repositories/bookingBook.repository';

export class GetBookingsBookUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(bookId: number): Promise<GetBookingsBookResponse[]> {
    try {


      return await this.getbookingBookRepository.getBookingsDatesByBookId(bookId);

    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error("internal server error");
    }
  }
}
