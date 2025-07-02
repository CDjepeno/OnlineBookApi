import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorsMessagesEnum } from 'src/domaine/enums/errors.enums';
import { UsersRepository } from 'src/domaine/user/repositories/user.repository';
import { AddUserRequest } from 'src/domaine/user/usecases/adduser/add.user.request';
import { AddUserResponse } from 'src/domaine/user/usecases/adduser/add.user.response';
import { CurrentUserResponse } from 'src/domaine/user/usecases/auth/current.user.response';
import { LoginUserRequest } from 'src/domaine/user/usecases/getuser/login.user.request';
import { LoginUserResponse } from 'src/domaine/user/usecases/getuser/login.user.response';
import { Repository } from 'typeorm';
import { handleDatabaseError } from '../common/errors/errorsSwitch';
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
      };

      return response;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
