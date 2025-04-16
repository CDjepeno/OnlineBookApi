import { HttpException } from '@nestjs/common';
import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { UsersRepository } from 'src/repositories/user.repository';
import { CurrentUserResponse } from './current.user.response';

export class GetCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string): Promise<CurrentUserResponse> {
    try {
      const user = await this.usersRepository.getCurrentUser(email);

      const responses: CurrentUserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      return responses;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
      }

      throw new InternalServerException(
        "Erreur interne du serveur. Impossible de récupérer l'utilisateur.",
      );
    }
  }
}
