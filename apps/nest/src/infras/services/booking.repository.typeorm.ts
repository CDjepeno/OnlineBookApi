import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from 'src/domaine/booking/entities/booking.entity';
import { BookingRepository } from 'src/domaine/booking/repositories/booking.repository';
import { AddBookingResponse } from 'src/domaine/booking/usecases/addBooking/addBooking.response';
import { GetBookingsByUserResponse } from 'src/domaine/booking/usecases/getBookingsByUser/getBookingsByUser.response';
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
        hasFuturReservation: AddBookingRequest.hasFuturReservation,
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
            b.hasFuturReservation,
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
            b.hasFuturReservation,
          ),
      );
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getBookingsByUser(
    userId: number,
  ): Promise<GetBookingsByUserResponse[]> {
    try {
      return await this.bookingRepository
        .createQueryBuilder('b')
        .innerJoin('b.book', 'book')
        .select([
          'b.id AS bookingId',
          'book.id AS bookId',
          'book.title AS title',
          'book.coverUrl AS coverUrl',
          'b.startAt AS startAt',
          'b.endAt AS endAt',
          `(SELECT COUNT(*) 
          FROM bookings bb 
          WHERE bb.bookId = book.id 
          AND bb.startAt > NOW()
        ) > 0 AS hasFutureReservation`,
        ])
        .where('b.userId = :userId', { userId })
        .orderBy('b.startAt', 'DESC')
        .getRawMany();
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
