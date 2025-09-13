import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  ConflictException,
  InternalServerException,
} from 'src/domaine/errors/onlineBook.error';
import { UsersRepository } from '../../repositories/user.repository';
import { LoginGoogleRequest } from './login.google.request';
import { LoginGoogleResponse } from './login.google.response';

export class LoginGoogleUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LoginGoogleRequest): Promise<LoginGoogleResponse> {
    try {
      return await this.usersRepository.loginOrSignUpWithGoogle(
        request.idToken,
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DUPLICATE_EMAIL) {
          throw new ConflictException(
            "L'email est déjà utilisé avec un autre provider.",
          );
        }

        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Erreur base de données.');
        }
      }
      throw new InternalServerException(
        'Une erreur est survenue lors du login Google.',
      );
    }
  }
}
