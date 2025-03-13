import { HttpException } from '@nestjs/common';
import { User } from 'src/domaine/entities/User.entity';
import {
  BadRequestException,
  ConflictException,
  InternalServerException,
} from 'src/domaine/errors/onlineBook.error';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { UsersRepository } from 'src/repositories/user.repository';
import { AddUserRequest } from './add.user.request';
import { AddUserResponse } from './add.user.response';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';

export class AddUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: AddUserRequest): Promise<AddUserResponse> {
    try {
      const regexPhone = /^((\+)33)|(0)[6-7](\d{2}){4}$/;
      if (!regexPhone.test(request.phone)) {
        throw new BadRequestException("Numero n'est pas valide");
      }

      const user = new User(
        request.id!,
        request.name,
        request.password,
        request.email,
        request.phone,
        request.sexe,
      );

      await this.usersRepository.signUp(user);

      await this.nodemailerClient.sendMail({
        to: request.email,
        subject: `Confirmation de votre inscription`,
        text: `Bonjour ${request.name}, \nVotre compte a bien été crée`,
      });

      return {
        msg: 'Votre compte a bien ete cree!, un mail vous a été envoyer',
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DUPLICATE_EMAIL) {
          throw new ConflictException("l'email est déja utiliser");
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException("Database Error");
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
