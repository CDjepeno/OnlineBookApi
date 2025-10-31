import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/domaine/book/entities/Book.entity';
import { BookingEntity } from 'src/domaine/booking/entities/booking.entity';
import { BookingRepository } from 'src/domaine/booking/repositories/booking.repository';
import { AddBookingResponse } from 'src/domaine/booking/usecases/addBooking/addBooking.response';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Booking } from '../models/booking.model';

export class BookingRepositoryTypeorm implements BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createBooking(
    AddBookingRequest: BookingEntity,
  ): Promise<AddBookingResponse> {
    try {
      const booking = this.bookingRepository.create({
        startAt: AddBookingRequest.startAt,
        endAt: AddBookingRequest.endAt,
        userId: AddBookingRequest.userId,
        bookId: AddBookingRequest.bookId,
      });
      await this.bookingRepository.save(booking);
      return { message: 'Réservation enregistrée' };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findOverlappingBookings(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<BookingEntity[]> {
    try {
      const overlap = await this.bookingRepository.find({
        where: [
          {
            book: { id: bookId },
            startAt: LessThanOrEqual(endAt),
            endAt: MoreThanOrEqual(startAt),
          },
        ],
      });
      return overlap.map(
        (b) =>
          new BookingEntity(
            b.id,
            b.createdAt,
            b.startAt,
            b.endAt,
            b.userId,
            b.bookId,
          ),
      );
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findBookingsByBookId(bookId: number): Promise<BookingEntity[]> {
    try {
      const bookings = await this.bookingRepository.find({
        where: { book: { id: bookId } },
        order: { startAt: 'ASC' },
      });

      return bookings.map(
        (b) =>
          new BookingEntity(
            b.id,
            b.createdAt,
            b.startAt,
            b.endAt,
            b.userId,
            b.bookId,
          ),
      );
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getBookingsByUser(
    userId: number,
  ): Promise<{ booking: BookingEntity; book: BookEntity }[]> {
    try {
      const booking = await this.bookingRepository.find({
        where: { userId },
        relations: ['book'],
        order: { startAt: 'DESC' },
      });
      return booking.map((b) => ({
        booking: new BookingEntity(
          b.id,
          b.createdAt,
          b.startAt,
          b.endAt,
          b.userId,
          b.bookId,
        ),
        book: new BookEntity(
          b.book.id,
          b.book.title,
          b.book.description,
          b.book.author,
          b.book.releaseAt,
          b.book.coverUrl,
          b.book.userId,
        ),
      }));
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
