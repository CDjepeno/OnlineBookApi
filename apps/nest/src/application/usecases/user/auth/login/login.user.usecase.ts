import { LoginUserResponse } from './login.user.response';
import { LoginUserRequest } from './login.user.request';
import { UsersRepository } from 'src/repositories/user.repository';

export class LoginUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    return await this.usersRepository.signIn(request);
  }
}
