import { InjectRepository } from '@nestjs/typeorm';
import { BookingBookRequest } from 'src/application/usecases/booking/bookingBook/bookingBook.request';
import { GetBookingsDatesByBookResponse } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.response';
import {
  GetBookingUserPaginationResponse,
  GetBookingUserResponse,
} from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';
import { UpdateBookingUserRequest } from 'src/application/usecases/booking/updateBooking/updateBookingUser.request';
import {
  InternalServerException,
  TypeOrmException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { Between, QueryFailedError, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Booking } from '../models/booking.model';

export class BookingRepositoryTypeorm implements BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {}

  async Order(bookReserved: BookingBookRequest): Promise<void> {
    try {
      const newBooking = new Booking();
      newBooking.createdAt = bookReserved.createdAt;
      newBooking.startAt = bookReserved.startAt;
      newBooking.endAt = bookReserved.endAt;
      newBooking.userId = bookReserved.userId;
      newBooking.bookId = bookReserved.bookId;

      await this.repository.save(newBooking);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async isBookReserved(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<boolean> {
    try {
      const existingBooking = await this.repository.findOne({
        where: [
          { bookId, startAt: Between(startAt, endAt) },
          { bookId, endAt: Between(startAt, endAt) },
        ],
      });

      return !!existingBooking;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        'Probleme serveur impossible de récuperer la reservation.',
      );
    }
  }

  async getBookingsDatesByBookId(
    bookId: number,
  ): Promise<GetBookingsDatesByBookResponse[]> {
    try {
      return this.repository.find({
        where: { bookId },
        select: ['startAt', 'endAt'],
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async getBookingsUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBookingUserPaginationResponse> {
    try {
      const currentPage = Math.max(0, page - 1);
      const take = limit > 0 ? limit : 6;
      const skip = currentPage * take;

      const raw = await this.repository.query(
        `
      SELECT 
        booking.id AS bookingId,
        book.id AS bookId,
        book.title AS title,
        book.coverUrl AS coverUrl,
        booking.startAt AS startAt,
        booking.endAt AS endAt
      FROM booking
      LEFT JOIN book ON booking.bookId = book.id
      WHERE booking.userId = ?
      ORDER BY booking.startAt ASC
      LIMIT ${take} OFFSET ${skip}
    `,
        [userId],
      );

      if (raw) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      // Calcul de hasFuturReservation pour chaque réservation
      const bookings: GetBookingUserResponse[] = await Promise.all(
        raw.map(async (booking: GetBookingUserResponse) => {
          // Vérification des futures réservations pour ce livre
          const hasFuturReservation = await this.repository
            .createQueryBuilder('futurBooking')
            .where('futurBooking.bookId = :bookId', { bookId: booking.bookId })
            .andWhere('futurBooking.startAt > CURRENT_TIMESTAMP') // Réservations futures uniquement
            .getCount();

          return {
            bookingId: booking.bookingId,
            BookId: booking.bookId,
            title: booking.title,
            coverUrl: booking.coverUrl,
            startAt: booking.startAt,
            endAt: booking.endAt,
            hasFuturReservations: hasFuturReservation > 0, // Retourne true si des réservations futures existent
          };
        }),
      );

      if (bookings) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      const totalBooks = await this.repository
        .createQueryBuilder('booking')
        .where('booking.userId = :userId', { userId })
        .getCount();

      return {
        bookings,
        pagination: {
          totalBookings: 10,
          currentPage: page,
          totalPages: Math.ceil(totalBooks / take),
        },
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBookingUser(
    updateBooking: UpdateBookingUserRequest,
  ): Promise<void> {
    try {
      await this.repository.update(updateBooking.id, updateBooking);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw new InternalServerException(
        'Probleme serveur impossible de modifier la reservation',
      );
    }
  }

  async deleteBooking(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBookings(ids: Array<string>): Promise<void> {
    try {
      const deletionPromises = ids.map((id) => this.repository.delete(id));

      const results = await Promise.all(deletionPromises);

      results.forEach((result) => {
        if (result.affected === 0) {
          throw new Error(ErrorsMessagesEnum.NOT_FOUND);
        }
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw new Error(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
    }
  }
}
