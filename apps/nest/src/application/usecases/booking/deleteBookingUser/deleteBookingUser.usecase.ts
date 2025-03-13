import { HttpException } from '@nestjs/common';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { DeleteBookingUserResponse } from './deleteBookingUser.response';

export class DeleteBookingUserUsecase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(id: number): Promise<DeleteBookingUserResponse> {
    try {
      await this.bookingRepository.deleteBooking(id);
      return { msg: `La réservation a bien été supprimé.` };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
