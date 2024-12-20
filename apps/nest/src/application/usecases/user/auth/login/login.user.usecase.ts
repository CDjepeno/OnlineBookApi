import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { LoginUserRequest } from './login.user.request';
import { LoginUserResponse } from './login.user.response';

export class LoginUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    return await this.usersRepository.signIn(request);
  }
}
