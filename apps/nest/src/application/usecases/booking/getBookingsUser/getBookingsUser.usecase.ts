import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingRepository } from 'src/domaine/repositories/bookingBook.repository';
import { GetBookingsUserResponse } from './getBookingsUser.response';

export class GetBookingsUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(userId: number): Promise<GetBookingsUserResponse[]> {
    try {
      return await this.getbookingBookRepository.getBookingsUser(userId);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error("internale server error");
    }
  }
}
