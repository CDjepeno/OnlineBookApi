import { HttpException } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/user.repository';
import { OAuthGoogleResponse } from './OAuthGoogle.response';
import { credentialGoogleResponse } from 'src/infras/controllers/user/OAuth-google/oauth.google.controller';

export class OAuthGoogleUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: credentialGoogleResponse): Promise<OAuthGoogleResponse> {
    try {
      return await this.usersRepository.validateOrCreateGoogleUser(request);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }
}
