import { BadRequestException, ConflictException } from '@nestjs/common';
import cron from 'node-cron';
import { BookingEntity } from 'src/domaine/entities/Booking.entity';
import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { ConsumerKafkajsClient } from 'src/infras/clients/kafka/consumer.client';
import { ProducerKafkaClient } from 'src/infras/clients/kafka/producer.client';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { SocketClient } from 'src/infras/clients/socket/socket.client';
import { BookingRepository } from 'src/repositories/bookingBook.repository';
import { BookingBookRequest } from './bookingBook.request';
import { BookingBookResponse } from './bookingBook.response';
export class BookingBookUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly producerKafkaClient: ProducerKafkaClient,
    private readonly consumerKafkaClient: ConsumerKafkajsClient,
    private readonly emailService: NodemailerClient,
    private readonly socketService: SocketClient,
  ) {}

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

      await this.bookingRepository.Order(book);

      this.producerKafkaClient.produce(
        {
          value: JSON.stringify({
            userId: request.userId,
            bookId: request.bookId,
            email: request.email,
            reminderDate: request.endAt,
            message: '[JANVIER] => Reminder: Return your book tomorrow!',
          }),
        },
        'notifications',
      );
      await this.consumerKafkaClient.consume();

      const endDate = new Date(request.endAt); // Convertir en objet Date

      // Formatter en une chaîne lisible

      // const reminderDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24hours
      // const reminderDate = new Date(endDate.getTime() - 9 * 60 * 60 * 1000); // 9 heures en millisecondes;
      // const reminderDate = new Date(endDate.getTime() - (23 * 60 * 60 * 1000 + 30 * 60 * 1000)); // 23h30hours
      const now = new Date();
      const reminderDate = new Date(now.getTime() + 1 * 60 * 1000); // 1min

      if (reminderDate > now) {
        const cronExpression = `0 ${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${
          reminderDate.getMonth() + 1
        } *`;

        cron.schedule(cronExpression, async () => {
          try {
            const formattedDate = endDate.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            await this.emailService.sendMail({
              to: request.email!,
              subject: `Rappel : Retour de votre livre réservé !`,
              text: `Bonjour ${request.name}, 
                      \nCeci est un rappel que le livre que vous avez réservé, intitulé "${request.title}", doit être retourné le ${formattedDate}.
                      \nNous espérons que vous avez apprécié votre lecture ! 
                      \nCordialement,  
                      \nL'équipe de la bibliothèque OnlineBook`,
            });

            this.socketService.sendNotification(
              request.userId.toString(),
              `Votre livre "${request.title}" doit être retourné le ${formattedDate}`,
            );
          } catch (error) {
            console.error(`Erreur lors de l'envoi du rappel : ${error}`);
            throw error;
          }
        });
      }
      return { msg: 'Le livre a été réserver avec succès' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            'Probleme serveur impossible de reserver le livre',
          );
        }
      }
      throw error;
    }
  }
}
