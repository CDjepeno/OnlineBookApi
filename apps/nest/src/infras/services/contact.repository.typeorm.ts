import { InjectRepository } from '@nestjs/typeorm';
import { ContactRequest } from 'src/application/usecases/contact/contact.request';
import {
  InternalServerException,
  TypeOrmException,
} from 'src/domaine/errors/onlineBook.error';
import { ContactRepository } from 'src/repositories/contact.repository';
import { QueryFailedError, Repository } from 'typeorm';
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
        throw new TypeOrmException();
      }
      throw new InternalServerException("Problem serveur impossible d'envoyer le message");
    }
  }
}
