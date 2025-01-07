import { BadRequestException, ConflictException } from '@nestjs/common';
import { GetBookingUserPaginationResponse } from './getBookingsUser.response';
import { BookingRepository } from 'src/repositories/bookingBook.repository';

export class GetBookingsUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(userId: number, page: number, limit: number): Promise<GetBookingUserPaginationResponse> {
    try {
      return await this.getbookingBookRepository.getBookingsUser(userId, page, limit);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('internale server error');
    }
  }
}
