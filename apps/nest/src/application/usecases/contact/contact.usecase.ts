import { ContactEntity } from 'src/domaine/entities/Contact.entity';
import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { ContactRepository } from 'src/repositories/contact.repository';
import { ContactRequest } from './contact.request';
import { ContactResponse } from './contact.response';

export class ContactUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: ContactRequest): Promise<ContactResponse> {
    try {
      const contact = new ContactEntity(
        request.name,
        request.email,
        request.message,
      );

      await this.contactRepository.send(contact);

      await this.nodemailerClient.sendMail({
        to: request.email,
        subject: `Confirmation de votre demande de contact`,
        text: `Bonjour ${request.name}, Merci d'avoir contacté OnlineBook. 
          \nNous avons bien reçu votre message et nous nous engageons à vous répondre dans les plus brefs délais.
          \nNous vous remercions pour votre patience et votre compréhension.
          \nCordialement.
          \n\nLa Direction.`,
      });

      return {
        msg: 'Votre message a bien été recu un email vous a été envoyer',
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            "Problem serveur impossible d'envoyer le message",
          );
        }
      }
      throw error;
    }
  }
}
