import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { RefreshTokenRequest } from './refresh.token.request';
import { RefreshTokenResponse } from './refresh.token.response';

export class RefreshTokenUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await this.usersRepository.getRefreshToken(request);
  }
}
