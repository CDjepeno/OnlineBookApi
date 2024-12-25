import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { CurrentUserResponse } from './current.user.response';

export class GetCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string): Promise<CurrentUserResponse> {
    const user = await this.usersRepository.getCurrentUser(email);
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
