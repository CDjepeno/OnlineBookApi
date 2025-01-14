import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { DeleteBookingsUserResponse } from './deleteBookingsUser.response';

export class DeleteBookingsUserUsecase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(id: Array<string>): Promise<DeleteBookingsUserResponse> {
    await this.bookingRepository.deleteBookings(id);
    return { msg: `Les livres ont bien été supprimé.` };
  }
}
