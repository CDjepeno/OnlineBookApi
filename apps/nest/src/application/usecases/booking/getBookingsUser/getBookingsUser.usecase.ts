import { HttpException } from '@nestjs/common';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { GetBookingUserPaginationResponse } from './getBookingsUser.response';

export class GetBookingsUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBookingUserPaginationResponse> {
    try {
      return await this.getbookingBookRepository.getBookingsUser(
        userId,
        page,
        limit,
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
