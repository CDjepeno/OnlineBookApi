import { LoginUserResponse } from './login.user.response';
import { LoginUserRequest } from './login.user.request';
import { UsersRepository } from 'src/repositories/user.repository';
import { RedisClient } from 'src/infras/clients/redis/redis.client';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';

export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisClient: RedisClient,
    private nodemailerClient: NodemailerClient,
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const { email } = await this.usersRepository.signIn(request);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.nodemailerClient.sendMail({
      to: email,
      subject: `Code de vérification`,
      text: `Bonjour voici votre code de vérification: \n${otp}`,
    });
    await this.redisClient.saveOtp(email, otp);

    return { msg: 'Un code vous a été envoyer par mail' };
  }
}
