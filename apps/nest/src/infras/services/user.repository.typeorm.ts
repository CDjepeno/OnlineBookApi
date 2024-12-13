import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LogoutUserRequest } from 'src/application/usecases/logout/logout.user.request';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/login/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/login/login.user.response';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../domaine/repositories/user.repository';
import { User } from '../models/user.model';

@Injectable()
export class UserRepositoryTyperom implements UsersRepository {
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

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '16',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: '24h',
    });

    await this.repository.update(user.id, { refreshToken: refreshToken });

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
      throw new Error(
        "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      );
    }
  }
}
