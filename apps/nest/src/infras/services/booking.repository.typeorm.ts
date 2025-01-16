import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingBookRequest } from 'src/application/usecases/booking/bookingBook/bookingBook.request';
import { BookingBookResponse } from 'src/application/usecases/booking/bookingBook/bookingBook.response';
import { GetBookingsBookResponse } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.response';
import {
  GetBookingUserPaginationResponse,
  GetBookingUserResponse,
} from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';
import { UpdateBookingUserRequest } from 'src/application/usecases/booking/updateBooking/updateBookingUser.request';
import { UpdateBookingUserResponse } from 'src/application/usecases/booking/updateBooking/updateBookingUser.response';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { Between, QueryFailedError, Repository } from 'typeorm';
import { Booking } from '../models/booking.model';

export class BookingRepositoryTypeorm implements BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {}

  async Order(bookReserved: BookingBookRequest): Promise<BookingBookResponse> {
    try {
      const newBooking = new Booking();
      newBooking.createdAt = bookReserved.createdAt;
      newBooking.startAt = bookReserved.startAt;
      newBooking.endAt = bookReserved.endAt;
      newBooking.userId = bookReserved.userId;
      newBooking.bookId = bookReserved.bookId;

      await this.repository.save(newBooking);

      return { msg: 'Le livre a été réserver avec succès' };
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      throw new InternalServerErrorException(
        'Impossible de reserver le livre.',
      );
    }
  }

  async isBookReserved(
    bookId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<boolean> {
    const existingBooking = await this.repository.findOne({
      where: [
        { bookId, startAt: Between(startAt, endAt) },
        { bookId, endAt: Between(startAt, endAt) },
      ],
    });

    return !!existingBooking;
  }

  async getBookingsDatesByBookId(
    bookId: number,
  ): Promise<GetBookingsBookResponse[]> {
    return this.repository.find({
      where: { bookId },
      select: ['startAt', 'endAt'],
    });
  }

  async getBookingsUser(
    userId: number,
    page: number,
    limit: number,
  ): Promise<GetBookingUserPaginationResponse> {
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
  }

  async updateBookingUser(
    updateBooking: UpdateBookingUserRequest,
  ): Promise<UpdateBookingUserResponse> {
    try {
      await this.repository.update(updateBooking.id, updateBooking);
      return { msg: 'votre reservation a bien été modifier' };
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
      throw new InternalServerErrorException(
        'Impossible de reserver le livre.',
      );
    }
  }

  async deleteBooking(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Aucune réservation trouvé avec l'id "${id}"`,
        );
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          "Impossible de supprimer la réservation : elle est référencé par d'autres entités.",
        );
      }
      throw new InternalServerErrorException(
        'Impossible de supprimer le livre.',
      );
    }
  }

  async deleteBookings(ids: Array<string>): Promise<void> {
    try {
      const deletionPromises = ids.map((id) => this.repository.delete(id));

      const results = await Promise.all(deletionPromises);

      results.forEach((result, index) => {
        if (result.affected === 0) {
          throw new NotFoundException(
            `Aucune réservation trouvé avec l'id "${ids[index]}"`,
          );
        }
      });
    } catch (error) {
      Logger.log(error);
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Impossible de supprimer les reservation : il est référencé par d’autres entités.',
        );
      }
      throw new InternalServerErrorException(
        'Impossible de supprimer les reservations.',
      );
    }
  }
}
