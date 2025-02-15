export interface Imessage {
  to: string;
  subject?: string;
  text?: string;
}

export interface ClientMailPort {
  sendMail(message: Imessage): Promise<void>;
}
