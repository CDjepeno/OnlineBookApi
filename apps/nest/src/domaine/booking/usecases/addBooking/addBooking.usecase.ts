import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ClientMailRepository } from 'src/domaine/user/repositories/client.mail.repository';
import { UsersRepository } from 'src/domaine/user/repositories/user.repository';
import { BookingEntity } from '../../entities/booking.entity';
import { BookingRepository } from '../../repositories/booking.repository';
import { AddBookingRequest } from './addBooking.request';
import { AddBookingResponse } from './addBooking.response';

export class AddBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userRepository: UsersRepository,
    private readonly clientMailRepository: ClientMailRepository,
  ) {}

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

    const user = await this.userRepository.getUserById(request.userId);

    if (!user) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur avec l'ID ${request.userId}`,
      );
    }

    await this.clientMailRepository.sendMail({
      to: user.email,
      subject: `Confirmation de réservation 📚`,
      text: `Bonjour ${
        user.name
      },\n\nVotre réservation est confirmée.\nDu ${startAt.toLocaleDateString()} au ${endAt.toLocaleDateString()}.\n\nMerci 🚀`,
    });

    return { message: 'Votre réservation a bien été créée' };
  }
}
