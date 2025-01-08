import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { UpdateBookingUserRequest } from './updateBookingUser.request';
import { UpdateBookingUserResponse } from './updateBookingUser.response';

export class UpdateBookingUserUseCase {
  constructor(private readonly getbookingBookRepository: BookingRepository) {}

  async execute(
    upddaBookingRequest: UpdateBookingUserRequest,
  ): Promise<UpdateBookingUserResponse> {
    return await this.getbookingBookRepository.updateBookingUser(
      upddaBookingRequest,
    );
  }
}
