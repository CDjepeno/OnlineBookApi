import {
  BadRequestException,
  ConflictException,
} from 'src/domaine/errors/onlineBook.error';
import { BookingEntity } from '../entities/booking.entity';
import { BookingRepository } from '../repositories/booking.repository';
import { AddBookingRequest } from './addBooking.request';
import { AddBookingResponse } from './addBooking.response';

export class AddBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(request: AddBookingRequest): Promise<AddBookingResponse> {
    const startAt = new Date(request.startAt);
    const endAt = new Date(request.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException(
        'La date de début doit être antérieure à la date de fin.',
      );
    }

    const overlapping = await this.bookingRepository.findOverlappingBookings(
      request.bookId,
      startAt,
      endAt,
    );

    if (overlapping.length > 0) {
      throw new ConflictException(
        'Le livre est déjà réservé pour cette période.',
      );
    }

    const booking = new BookingEntity(
      Date.now(),
      new Date(),
      startAt,
      endAt,
      request.userId,
      request.bookId,
    );

    await this.bookingRepository.createBooking(booking);

    return { message: 'Votre réservation a bien été créée' };
  }
}
