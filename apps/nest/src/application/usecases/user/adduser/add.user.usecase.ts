import { User } from 'src/domaine/entities/User.entity';
import { InvalidPhoneNumberException } from 'src/domaine/errors/book.error';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { AddUserRequest } from './add.user.request';
import { AddUserResponse } from './add.user.response';
import { UsersRepository } from 'src/repositories/user.repository';

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
    
    const user = new User(
      request.id!,
      request.name,
      request.password,
      request.email,
      request.phone,
      request.sexe,
    );

    const res = await this.usersRepository.signUp(user);

    if(res) {
      await this.nodemailerClient.sendMail({
        to: request.email,
        subject: `Confirmation de votre inscription`,
        text: `Bonjour ${request.name}, \nVotre compte a bien été crée`,
      });
      return res
    }
    throw new Error("une erreur est survenue");
  }
}
