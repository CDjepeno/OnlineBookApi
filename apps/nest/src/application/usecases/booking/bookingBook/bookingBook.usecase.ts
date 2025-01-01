import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingEntity } from 'src/domaine/entities/Booking.entity';
import { BookingBookRequest } from './bookingBook.request';
import { BookingBookResponse } from './bookingBook.response';
import { BookingRepository } from 'src/repositories/bookingBook.repository';

export class BookingBookUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(request: BookingBookRequest): Promise<BookingBookResponse> {
    try {
      if (request.startAt >= request.endAt) {
        throw new BadRequestException(
          'La date de début doit être antérieure à la date de fin.',
        );
      }

      const isBookReserved = await this.bookingRepository.isBookReserved(
        request.bookId,
        request.startAt,
        request.endAt,
      );

      if (isBookReserved) {
        throw new ConflictException(
          'Le livre est déjà réservé pour cette période.',
        );
      }

      const book = new BookingEntity(
        request.id!,
        request.createdAt,
        request.startAt,
        request.endAt,
        request.userId,
        request.bookId,
      );

      const res = await this.bookingRepository.Order(book);

      return res;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error("internal server error");
    }
  }
}
