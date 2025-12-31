import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import {
  InternalServerException,
  NotFoundException,
} from 'src/domaine/errors/onlineBook.error';
import { UsersRepository } from '../../repositories/user.repository';
import { GetUserByIdRequest } from './getUserById.request';
import { GetUserByIdResponse } from './getUserById.response';

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    try {
      const user = await this.usersRepository.getUserById(request.id);

      const response: GetUserByIdResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        sexe: user.sexe,
      };

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException(
            'Aucun utilisateur correspondant n\'a été trouvé',
          );
        }

        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
      }

      throw new InternalServerException(
        'Erreur interne du serveur. Impossible de récupérer l\'utilisateur.',
      );
    }
  }
}
