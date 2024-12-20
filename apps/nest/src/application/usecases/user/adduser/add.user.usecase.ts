import { User } from 'src/domaine/entities/User.entity';
import { InvalidPhoneNumberException } from 'src/domaine/errors/book.error';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { UsersRepository } from '../../../../domaine/repositories/user.repository';
import { AddUserRequest } from './add.user.request';
import { AddUserResponse } from './add.user.response';

export class AddUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: AddUserRequest): Promise<AddUserResponse> {
    const regexPhone = /^((\+)33)|(0)[6-7](\d{2}){4}$/;
    if (!regexPhone.test(request.phone)) {
      throw new InvalidPhoneNumberException("Numero n'est pas valide");
    }

    await this.nodemailerClient.sendMail({
      to: request.email,
      subject: `Confirmation de votre inscription`,
      text: `Bonjour ${request.name}, \nVotre compte a bien été crée`,
    });

    const user = new User(
      request.id,
      request.name,
      request.email,
      request.password,
      request.phone,
    );

    return await this.usersRepository.signUp(user);
  }
}
