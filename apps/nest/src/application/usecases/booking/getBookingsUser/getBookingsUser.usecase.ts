import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingRepository } from 'src/domaine/repositories/bookingBook.repository';
import { GetBookingUserPaginationResponse } from './getBookingsUser.response';

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
