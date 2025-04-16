import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
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
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        throw error;
      }
      throw new InternalServerException(
        "Une erreur interne du serveur s'est produite, Veuillez réessayer plus tard.",
      );
    }
  }
}
