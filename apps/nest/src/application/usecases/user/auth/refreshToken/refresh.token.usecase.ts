import { UsersRepository } from 'src/repositories/user.repository';
import { RefreshTokenRequest } from './refresh.token.request';
import { RefreshTokenResponse } from './refresh.token.response';
import { HttpException } from '@nestjs/common';

export class RefreshTokenUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      return await this.usersRepository.getRefreshToken(request);
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
