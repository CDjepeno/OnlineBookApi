import { InjectRepository } from '@nestjs/typeorm';
import { ContactRequest } from 'src/application/usecases/contact/contact.request';
import { ContactRepository } from 'src/repositories/contact.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { Contact } from '../models/contact.model';

export class ContactRepositoryTypeorm implements ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async send(request: ContactRequest): Promise<void> {
    try {
      await this.contactRepository.save(request);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw error;
    }
  }
}
