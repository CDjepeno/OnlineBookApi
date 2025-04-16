import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/getuser/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/getuser/login.user.response';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../repositories/user.repository';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
import { User } from '../models/user.model';
import { ErrorsMessagesEnum } from 'src/enums/errors.enums';

@Injectable()
export class UserRepositoryTyperom implements UsersRepository {
  private readonly logger = new Logger(UserRepositoryTyperom.name);
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
      handleDatabaseError(error);
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
      expiresIn: '24h',
    });

    return { name: user.name, email: user.email, token };
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
      };

      return response;
    } catch (errors) {
      this.logger.error(
        "Erreur lors de la récupération de l'utilisateur:",
        errors,
      );
      throw new Error(
        "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      );
    }
  }
}
