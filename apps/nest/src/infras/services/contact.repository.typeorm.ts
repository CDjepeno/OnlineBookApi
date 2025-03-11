import { InjectRepository } from '@nestjs/typeorm';
import { ContactRequest } from 'src/application/usecases/contact/contact.request';
import { ContactRepository } from 'src/repositories/contact.repository';
import { Repository } from 'typeorm';
import { Contact } from '../models/contact.model';

export class ContactRepositoryTypeorm implements ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async send(request: ContactRequest): Promise<void> {
    await this.contactRepository.save(request);

  }
}
