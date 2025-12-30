import { HttpException } from '@nestjs/common';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { UsersRepository } from '../../repositories/user.repository';
import { DeleteUserResponse } from './delete.user.response';

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: number): Promise<DeleteUserResponse> {
    try {
      await this.usersRepository.getUserById(id);

      await this.usersRepository.deleteUser(id);

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Utilisateur non trouvé');
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
        "Problème serveur impossible de supprimer l'utilisateur",
      );
    }
  }
}
