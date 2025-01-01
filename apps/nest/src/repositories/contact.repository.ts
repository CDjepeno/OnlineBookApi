import { ContactRequest } from "src/application/usecases/contact/contact.request";
import { ContactResponse } from "src/application/usecases/contact/contact.response";

export interface ContactRepository {
  send(request: ContactRequest): Promise<ContactResponse>
}