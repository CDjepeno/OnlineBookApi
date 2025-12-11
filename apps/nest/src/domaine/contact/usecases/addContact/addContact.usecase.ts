import { ClientMailRepository } from 'src/domaine/user/repositories/client.mail.repository';
import { ContactRepository } from '../../repositories/contact.repository';
import { AddContactRequest } from './addContact.request';
import { AddContactResponse } from './addContact.response';

export class AddContactUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly clientMailRepository: ClientMailRepository,
  ) {}

  async execute(request: AddContactRequest): Promise<AddContactResponse> {
    await this.contactRepository.addContact(request);

    await this.clientMailRepository.sendMail({
      to: request.email,
      subject: `Merci pour votre message`,
      text: `Bonjour ${request.name}, Merci d'avoir contacté OnlineBook. 
        Nous avons bien reçu votre message et nous nous engageons à vous répondre dans les plus brefs délais.
        Nous vous remercions pour votre patience et votre compréhension.

        Cordialement,
        L'équipe OnlineBook.
              `,
    });

    return {
      message: 'Votre message a bien été  recu. Un email vous a été envoyer',
    };
  }
}
