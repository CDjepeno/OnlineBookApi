import { InjectRepository } from '@nestjs/typeorm';
import { ContactRequest } from 'src/application/usecases/contact/contact.request';
import { ContactResponse } from 'src/application/usecases/contact/contact.response';
import { ContactRepository } from 'src/repositories/contact.repository';
import { Repository } from 'typeorm';
import { Contact } from '../models/contact.model';

export class ContactRepositoryTypeorm implements ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async send(request: ContactRequest): Promise<ContactResponse> {
    await this.contactRepository.save(request);

    return {msg:'Votre message a bien été recu un email vous a été envoyer'};
  }
}
