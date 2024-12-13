import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { LogoutUserRequest } from './logout.user.request';

export class LogoutUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LogoutUserRequest): Promise<void> {
    try {
      return await this.usersRepository.signOut(request);
    } catch (error) {
      throw error;
    }
  }
}
