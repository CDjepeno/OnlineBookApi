import { AddContactResponse } from '../usecases/addContact/addContact.response';

export interface ContactRepository {
  addContact(data: AddContactResponse): Promise<void>;
}
