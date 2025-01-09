import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { DeleteBookingUserResponse } from './deleteBookingUser.response';

export class DeleteBookingUserUsecase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(id: number): Promise<DeleteBookingUserResponse> {
    await this.bookingRepository.deleteBooking(id);
    return {msg:`Le livre a bien été supprimé.`};
  }
}
