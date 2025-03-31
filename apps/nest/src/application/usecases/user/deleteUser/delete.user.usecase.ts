import { HttpException } from '@nestjs/common';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { UsersRepository } from 'src/repositories/user.repository';
import { DeleteUserResponse } from './delete.user.response';

export class DeleteUserUsecase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(id: number): Promise<DeleteUserResponse> {
    try {
      await this.repository.deleteUser(id);
      return { msg: `L'utilisateur a bien été supprimer` };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun Utilisateur trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            `Probleme serveur impossible de supprimer l'utilisateur`,
          );
        }
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw error
    }
  }
}
