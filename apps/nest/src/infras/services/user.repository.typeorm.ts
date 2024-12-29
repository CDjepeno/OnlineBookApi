import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserResponse } from 'application/usecases/user/auth/login/login.user.response';
import * as bcrypt from 'bcrypt';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import {
  CurrentUserResponse,
} from 'src/application/usecases/user/auth/GetCurrentUser/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/auth/login/login.user.request';
import { LogoutUserRequest } from 'src/application/usecases/user/auth/logout/logout.user.request';
import { RefreshTokenRequest } from 'src/application/usecases/user/auth/refreshToken/refresh.token.request';
import { RefreshTokenResponse } from 'src/application/usecases/user/auth/refreshToken/refresh.token.response';
import { UpdateUserRequest } from 'src/application/usecases/user/updateUser/update.user.request';
import { UpdateUserResponse } from 'src/application/usecases/user/updateUser/update.user.response';
import { UsersRepository } from 'src/domaine/repositories/user.repository';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { CurrentUserByIdResponse } from 'src/application/usecases/user/GetUserById/current.user.response';

@Injectable()
export class UserRepositoryTypeorm implements UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new UnauthorizedException('Cet email est deja utilise.');
      }
      throw new Error(error);
    }
  }

  async signIn(siginIn: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password } = siginIn;
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("L'utilisateur n'existe pas.");
    }

    const match = await bcrypt.compare(
      password.trim().toLowerCase(),
      user.password,
    );

    if (!match) {
      throw new UnauthorizedException('Le mot de passe est invalide.');
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
      expiresIn: '30m',
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: '24h',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.repository.update(user.id, { refreshToken: hashedRefreshToken });

    return { name: user.name, email: user.email, token, refreshToken };
  }

  async signOut(request: LogoutUserRequest): Promise<void> {
    try {
      await this.repository.update({ id: request.id }, { refreshToken: null });
    } catch (error) {
      console.error('Error during signOut:', error);
      throw new Error(
        "Une erreur s'est produite lors de la deconexion de l'utilisateur.",
      );
    }
  }

  async getCurrentUser(email: string): Promise<CurrentUserResponse> {
    try {
      const userEntity = await this.repository.findOne({
        where: { email },
      });

      if (!userEntity) {
        throw new NotFoundException();
      }

      return userEntity;
    } catch (error) {
      console.error('Error during getCurrentUser:', error);

      throw new Error(
        "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      );
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

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token invalide.');
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.repository.update(user.id, {
        refreshToken: hashedNewRefreshToken,
      });

      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(
    user: Partial<UpdateUserRequest>,
    existingUser: CurrentUserByIdResponse,
  ): Promise<UpdateUserResponse> {
    try {
      existingUser.email = user.email;
      existingUser.name = user.name;
      existingUser.phone = user.phone;
      existingUser.password = user.password;
      existingUser.sexe = user.sexe;

      const res = await this.repository.save(existingUser);

      return res;
    } catch (error) {
      console.error("Erreur lors de la modification d'un livre :", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Impossible de modifier le l'utilisateur.`,
      );
    }
  }

  async getUserById(id: number): Promise<CurrentUserByIdResponse> {
    try {
      const userEntity = await this.repository.findOne({
        where: { id },
      });
      
      if (!userEntity) {
        throw new NotFoundException(`L'user avec l'id ${id} n'est pas trouver `);
      }

      return userEntity;
    } catch (error) {
      console.error('Error during getCurrentUser:', error);

      throw new Error(
        "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      );
    }
  }
}
