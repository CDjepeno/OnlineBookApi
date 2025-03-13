import { HttpException } from '@nestjs/common';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { UpdateBookingUserRequest } from './updateBookingUser.request';
import { UpdateBookingUserResponse } from './updateBookingUser.response';

export class UpdateBookingUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(
    upddaBookingRequest: UpdateBookingUserRequest,
  ): Promise<UpdateBookingUserResponse> {
    try {
      await this.getbookingBookRepository.updateBookingUser(
        upddaBookingRequest,
      );
      return { msg: 'votre reservation a bien été modifier' };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
