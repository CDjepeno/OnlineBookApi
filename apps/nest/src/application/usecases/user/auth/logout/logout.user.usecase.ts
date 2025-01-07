import { UsersRepository } from 'src/repositories/user.repository';
import { LogoutUserRequest } from './logout.user.request';

export class LogoutUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LogoutUserRequest): Promise<void> {
    return await this.usersRepository.signOut(request);
  }
}
