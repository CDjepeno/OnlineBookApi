import { HttpException } from '@nestjs/common';
import { User } from 'src/domaine/entities/User.entity';
import {
  BadRequestException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { UsersRepository } from 'src/repositories/user.repository';
import { UpdateUserRequest } from './update.user.request';
import { UpdateUserResponse } from './update.user.response';

export class UpdateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      const regexPhone = /^((\+)33)|(0)[6-7](\d{2}){4}$/;
      if (!regexPhone.test(request.phone)) {
        throw new BadRequestException("Numero n'est pas valide");
      }

      const existingUser = await this.userRepository.getUserById(+request.id!);

      if (!existingUser) {
        throw new NotFoundException(
          `L'user avec l'ID ${request.id} est introuvable.`,
        );
      }

      const user = new User(
        request.id!,
        request.name,
        request.password,
        request.email,
        request.phone,
        request.sexe,
      );

      await this.userRepository.updateUser(user, existingUser);

      return { msg: "L'utilisateur a été mis à jour avec succès" };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
