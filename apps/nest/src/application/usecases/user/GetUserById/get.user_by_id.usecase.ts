import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { CurrentUserByIdResponse } from './current.user.response';

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: number): Promise<CurrentUserByIdResponse> {
    const user = await this.usersRepository.getUserById(id);
    const responses = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      sexe: user.sexe,
    };
    return responses;
  }
}
