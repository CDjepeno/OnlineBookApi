import { ContactRequest } from "src/application/usecases/contact/contact.request";

export interface ContactRepository {
  send(request: ContactRequest): Promise<void>
}