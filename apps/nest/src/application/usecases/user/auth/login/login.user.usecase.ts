import {
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { RedisClient } from 'src/infras/clients/redis/redis.client';
import { UserRepositoryTypeorm } from 'src/infras/services/user.repository.typeorm';
import { LoginUserRequest } from './login.user.request';
import { LoginUserResponse } from './login.user.response';

export class LoginUserUseCase {
  constructor(
    private usersRepository: UserRepositoryTypeorm,
    private redisClient: RedisClient,
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
      if (error instanceof Error) {
        if (error.message === ErrorsMessagesEnum.INVALID_PASSPORT) {
          throw new UnauthorizedException("Le mot de passe n'est pas correct");
        }
        if (error.message === ErrorsMessagesEnum.DATABASE_ERROR) {
          throw new InternalServerException('Database Error');
        }
        if (error.message === ErrorsMessagesEnum.NOT_FOUND) {
          throw new NotFoundException('Aucun utilisateur trouvé');
        }
        if (error.message === ErrorsMessagesEnum.INTERNAL_SERVER_ERROR) {
          throw new InternalServerException(
            'Probleme serveur impossible de vous connecter',
          );
        }
      }
      throw error;
    }
  }
}
