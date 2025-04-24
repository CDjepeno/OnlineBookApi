export interface Imessage {
  to: string;
  subject?: string;
  text?: string;
}

export interface RepositoryMailPort {
  sendMail(message: Imessage): Promise<void>;
}
