import * as nodemailer from 'nodemailer';
import { ClientMailPort, Imessage } from 'src/repositories/client.mail.repository';


export default class NodemailerClient implements ClientMailPort {
  constructor(
    private readonly transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'onlinebookapi@gmail.com',
        pass: 'gccp eyxi tgph uagr',
      },
    }),
  ) {}

  async sendMail(message: Imessage): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: 'onlinebookapi@gmail.com',
        to: message.to,
        subject: message.subject,
        text: message.text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
