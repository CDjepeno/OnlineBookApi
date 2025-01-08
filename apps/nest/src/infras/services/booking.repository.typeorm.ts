import { InternalServerErrorException } from '@nestjs/common';
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
import { Between, Repository } from 'typeorm';
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

    const raw = await this.repository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.book', 'book')
      .where('booking.userId = :userId', { userId })
      .select([
        'book.id AS bookId',
        'book.title AS title',
        'book.coverUrl AS coverUrl',
        'booking.startAt AS startAt',
        'booking.endAt AS endAt',
      ])
      .skip(skip)
      .take(take)
      .getRawMany();

    console.log(raw);

    const bookings: GetBookingUserResponse[] = raw.map((booking) => ({
      BookId: booking.bookId,
      title: booking.name,
      coverUrl: booking.coverUrl,
      startAt: booking.startAt,
      endAt: booking.endAt,
    }));

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
}
