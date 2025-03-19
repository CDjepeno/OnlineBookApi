import { UsersRepository } from 'src/repositories/user.repository';
import { RedisClient } from 'src/infras/clients/redis/redis.client';
import { VerifyOtpRequest } from './verifyOtp.request';
import { VerifyOtpResponse } from './verifyOtp.response';
import { UnauthorizedException } from 'src/domaine/errors/onlineBook.error';

export class VerifyOtpUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisClient: RedisClient,
  ) {}

  async execute(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    // Vérifier l'OTP stocké (via Redis ou DB)
    const storedOtp = await this.redisClient.getOtp(request.email);

    if (!storedOtp || storedOtp !== request.otp) {
      throw new UnauthorizedException('Code OTP invalide ou expiré.');
    }

    // Supprimer l’OTP après vérification réussie
    await this.redisClient.deleteOtp(request.email);

    return this.usersRepository.createJwt(request.email);
  }
}
