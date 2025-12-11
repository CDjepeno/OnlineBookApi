import { InjectRepository } from '@nestjs/typeorm';
import { AddContactRequest } from 'src/domaine/contact/usecases/addContact/addContact.request';
import { Repository } from 'typeorm';
import { Contact } from '../models/contact.model';
import { ContactRepository } from 'src/domaine/contact/repositories/contact.repository';

export class ContactRepositoryTypeorm implements ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repositoryContact: Repository<Contact>,
  ) {}

  async addContact(data: AddContactRequest): Promise<void> {
    await this.repositoryContact.save(data);
  }
}
