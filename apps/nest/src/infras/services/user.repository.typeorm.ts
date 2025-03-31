import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/GetCurrentUser/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/auth/login/login.user.request';
import { LogoutUserRequest } from 'src/application/usecases/user/auth/logout/logout.user.request';
import { RefreshTokenRequest } from 'src/application/usecases/user/auth/refreshToken/refresh.token.request';
import { RefreshTokenResponse } from 'src/application/usecases/user/auth/refreshToken/refresh.token.response';
import { VerifyOtpResponse } from 'src/application/usecases/user/auth/verifyOtp/verifyOtp.response';
import { CurrentUserByIdResponse } from 'src/application/usecases/user/GetUserById/current.user.response';
import { UpdateUserRequest } from 'src/application/usecases/user/updateUser/update.user.request';
import {
  NotFoundException,
  TypeOrmException,
  UnauthorizedException,
} from 'src/domaine/errors/onlineBook.error';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';
import { UsersRepository } from 'src/repositories/user.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { User } from '../models/user.model';

@Injectable()
export class UserRepositoryTypeorm implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(addUserRequest: AddUserRequest): Promise<void> {
    try {
      const user = new User();
      user.email = addUserRequest.email;
      user.password = addUserRequest.password;
      user.name = addUserRequest.name;
      user.phone = addUserRequest.phone;
      user.sexe = addUserRequest.sexe;

      await this.repository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw error;
    }
  }

  async signIn(siginIn: LoginUserRequest): Promise<{ email: string }> {
    try {
      const { email, password } = siginIn;
      const user = await this.repository.findOne({
        where: { email },
      });
      if (!user) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      const match = await bcrypt.compare(
        password.trim().toLowerCase(),
        user.password,
      );

      if (!match) {
        throw new Error(ErrorsMessagesEnum.INVALID_PASSPORT);
      }

      return { email: user.email };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw error;
    }
  }

  async createJwt(email: string): Promise<VerifyOtpResponse> {
    try {
      const user = await this.repository.findOne({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException("L'utilisateur n'existe pas.");
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const refreshPayload = {
        sub: user.id,
        email: user.email,
        type: 'refresh',
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '7d',
      });

      const refreshToken: string | null = await this.jwtService.signAsync(
        refreshPayload,
        {
          secret: this.configService.get('REFRESH_JWT_SECRET'),
          expiresIn: '30d',
        },
      );

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.repository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return { email: user.email, name: user.name, refreshToken, token };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw error;
    }
  }

  async signOut(request: LogoutUserRequest): Promise<void> {
    try {
      await this.repository.update(
        { id: request.id },
        { refreshToken: undefined },
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw error;
    }
  }

  async getCurrentUser(email: string): Promise<CurrentUserResponse> {
    try {
      const userEntity = await this.repository.findOne({
        where: { email },
      });

      if (!userEntity) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }

      return userEntity;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw error;
    }
  }

  async getRefreshToken(
    refreshTokenRequest: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    try {
      const { refreshToken } = refreshTokenRequest;

      const tokenDecoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_JWT_SECRET'),
        ignoreExpiration: true,
      });

      const user = await this.repository.findOne({
        where: { id: tokenDecoded.sub },
      });

      const isRefreshTokenValid = bcrypt.compare(
        refreshToken,
        user!.refreshToken!,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token invalide.');
      }

      const payload = {
        sub: user!.id,
        email: user!.email,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '4d',
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.repository.update(user!.id, {
        refreshToken: hashedNewRefreshToken,
      });

      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw error;
    }
  }

  async updateUser(
    user: Partial<UpdateUserRequest>,
    existingUser: CurrentUserByIdResponse,
  ): Promise<void> {
    try {
      existingUser.email = user.email!;
      existingUser.name = user.name!;
      existingUser.phone = user.phone!;
      existingUser.password = user.password!;
      existingUser.sexe = user.sexe!;

      await this.repository.save(existingUser);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw error;
    }
  }

  async getUserById(id: number): Promise<CurrentUserByIdResponse> {
    try {
      const userEntity = await this.repository.findOne({
        where: { id },
      });

      if (!userEntity) {
        throw new NotFoundException(
          `L'user avec l'id ${id} n'est pas trouver `,
        );
      }

      return userEntity;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TypeOrmException();
      }
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new Error(ErrorsMessagesEnum.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        handleDatabaseError(error);
      }
      throw error;
    }
  }

}
