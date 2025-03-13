import { HttpException } from '@nestjs/common';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { RedisClient } from 'src/infras/clients/redis/redis.client';
import { UsersRepository } from 'src/repositories/user.repository';
import { LoginUserRequest } from './login.user.request';
import { LoginUserResponse } from './login.user.response';

export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisClient: RedisClient,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    try {
      const { email } = await this.usersRepository.signIn(request);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.nodemailerClient.sendMail({
        to: email,
        subject: `Code de vérification`,
        text: `Bonjour voici votre code de vérification: \n${otp}`,
      });
      await this.redisClient.saveOtp(email, otp);

      return { msg: 'Un code OTP vous a été envoyer par mail' };
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
