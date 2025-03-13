import { HttpException } from '@nestjs/common';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { DeleteBookingsUserResponse } from './deleteBookingsUser.response';

export class DeleteBookingsUserUsecase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(id: Array<string>): Promise<DeleteBookingsUserResponse> {
    try {
      await this.bookingRepository.deleteBookings(id);
      return { msg: `Les livres ont bien été supprimé.` };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
