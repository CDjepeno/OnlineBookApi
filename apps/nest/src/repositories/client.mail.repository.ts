export interface Imessage {
  to: string;
  subject?: string;
  text?: string;
}

export interface ClientMailRepository {
  sendMail(message: Imessage): Promise<void>;
}
