import { HttpException } from '@nestjs/common';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  ConflictException,
  InternalServerException,
} from 'src/domaine/errors/onlineBook.error';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { User } from '../../entities/User.entity';
import { UsersRepository } from '../../repositories/user.repository';
import { Phone } from '../../value-objects/phone.value-object';
import { AddUserRequest } from './add.user.request';
import { AddUserResponseType } from './add.user.response';

export class AddUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: AddUserRequest): Promise<AddUserResponseType> {
    try {
      const phone = new Phone(request.phone);

      await this.nodemailerClient.sendMail({
        to: request.email,
        subject: `Confirmation de votre inscription`,
        text: `Bonjour ${request.name}, \nVotre compte a bien été crée`,
      });

      const user = new User(
        request.id!,
        request.name,
        request.email,
        request.password,
        phone.getValue(),
        request.sexe,
      );

      await this.usersRepository.signUp(user);

      return { message: 'Votre compte a bien été crée' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DUPLICATE_EMAIL) {
          throw new ConflictException("l'email est déja utiliser");
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerException(
        "Probleme serveur impossible d'ajouter l'utilisateur",
      );
    }
  }
}
