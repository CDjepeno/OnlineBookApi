import { ContactEntity } from 'src/domaine/entities/Contact.entity';
import { ContactRequest } from './contact.request';
import { ContactResponse } from './contact.response';
import { ContactRepository } from 'src/repositories/contact.repository';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';

export class ContactUseCase {
  constructor(private readonly contactRepository: ContactRepository, private nodemailerClient: NodemailerClient) {}

  async execute(request: ContactRequest): Promise<ContactResponse> {
    const contact = new ContactEntity(
      request.name,
      request.email,
      request.message
    );
    
    const response = await this.contactRepository.send(contact);

    if(response) {
      await this.nodemailerClient.sendMail({
        to: request.email,
        subject: `Confirmation de votre inscription`,
        text: `Bonjour ${request.name}, Merci d'avoir contacté OnlineBook. 
        \nNous avons bien reçu votre message et nous nous engageons à vous répondre dans les plus brefs délais.
        \nNous vous remercions pour votre patience et votre compréhension.
        \nCordialement.
        \n\nLa Direction.`,
      });
      return response
    }
    throw new Error("une erreur est survenue");
  }
}
