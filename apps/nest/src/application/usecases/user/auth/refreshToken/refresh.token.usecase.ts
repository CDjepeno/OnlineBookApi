import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { RefreshTokenResponse } from './refresh.token.response';
import { RefreshTokenRequest } from './refresh.token.request';

export class RefreshTokenUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      return await this.usersRepository.getRefreshToken(request);
    } catch (error) {
      throw error;
    }
  }
}
