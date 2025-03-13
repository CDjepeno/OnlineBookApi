import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { UsersRepository } from 'src/repositories/user.repository';
import { CurrentUserResponse } from './current.user.response';

export class GetCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string): Promise<CurrentUserResponse> {
    try {
      const user = await this.usersRepository.getCurrentUser(email);
      const responses = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        sexe: user.sexe,
      };
      return responses;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun utilisateur courant trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            "Probleme serveur impossible recuperer l'utilisateur actuelle",
          );
        }
      }
      throw error;
    }
  }
}
