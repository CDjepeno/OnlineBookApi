import {
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { UsersRepository } from 'src/repositories/user.repository';
import { LoginUserRequest } from './login.user.request';
import { LoginUserResponse } from './login.user.response';

export class LoginUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    try {
      return await this.usersRepository.signIn(request);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException("Utilisateur n'existe pas");
        }
        if (error.message === ErrorsMessagesEnum.INVALID_PASSPORT) {
          throw new UnauthorizedException('Mot de passe invalide');
        }

        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
      }
      //throw error;
      throw new InternalServerException(
        "Une erreur interne du serveur s'est produite, Veuillez réessayer plus tard.",
      );
    }
  }
}
