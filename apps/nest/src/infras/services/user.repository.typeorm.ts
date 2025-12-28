import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import { InternalServerException } from 'src/domaine/errors/onlineBook.error';
import { UsersRepository } from 'src/domaine/user/repositories/user.repository';
import { AddUserRequest } from 'src/domaine/user/usecases/adduser/add.user.request';
import { AddUserResponse } from 'src/domaine/user/usecases/adduser/add.user.response';
import { CurrentUserResponse } from 'src/domaine/user/usecases/auth/current.user.response';
import { LoginUserRequest } from 'src/domaine/user/usecases/getuser/login.user.request';
import { LoginUserResponse } from 'src/domaine/user/usecases/getuser/login.user.response';
import { LoginGoogleResponse } from 'src/domaine/user/usecases/google/login.google.response';
import { Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { User } from '../models/user.model';

@Injectable()
export class UserRepositoryTypeorm implements UsersRepository {
  private client: OAuth2Client;
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async signUp(addUserRequest: AddUserRequest): Promise<AddUserResponse> {
    try {
      const user = new User();
      user.email = addUserRequest.email;
      user.password = addUserRequest.password;
      user.name = addUserRequest.name;
      user.phone = addUserRequest.phone;
      user.sexe = addUserRequest.sexe;

      return await this.repository.save(user);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async signIn(siginIn: LoginUserRequest): Promise<LoginUserResponse> {
    try {
      const { email, password } = siginIn;
      const user = await this.repository.findOne({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(ErrorsMessagesEnum.NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(ErrorsMessagesEnum.INVALID_PASSPORT);
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<'string'>('JWT_SECRET'),
        expiresIn: '24h',
      });

      return { name: user.name, email: user.email, token };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getCurrentUser(email: string): Promise<CurrentUserResponse> {
    try {
      const userEntity = await this.repository.findOne({
        where: { email },
      });

      if (!userEntity) {
        throw new NotFoundException(ErrorsMessagesEnum.NOT_FOUND);
      }

      const response: CurrentUserResponse = {
        id: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
        phone: userEntity.phone,
        sexe: userEntity.sexe
      };

      return response;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(ErrorsMessagesEnum.NOT_FOUND);
      }
      return user;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async loginOrSignUpWithGoogle(idToken: string): Promise<LoginGoogleResponse> {
    try {
      // Vérifie le token Google
      const tokenGoogle = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = tokenGoogle.getPayload();
      if (!payload || !payload.email) {
        throw new InternalServerException('Token Google invalide');
      }

      let user = await this.repository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        user = this.repository.create({
          name: payload.name || 'Utilisateur Google',
          email: payload.email,
        });

        user = await this.repository.save(user);
      }

      const jwtPayload = {
        sub: user.id,
        email: user.email,
      };

      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<'string'>('JWT_SECRET'),
        expiresIn: '24h',
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
