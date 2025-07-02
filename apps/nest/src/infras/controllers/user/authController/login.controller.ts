import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginUserResponse } from 'src/application/usecases/user/getuser/login.user.response';
import { LoginUserUseCase } from 'src/application/usecases/user/getuser/login.user.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { LoginDto } from './login.dto';

@Controller('auth')
export class LoginController {
  constructor(
    @Inject(UsecaseProxyModule.LOGIN_USER_USECASE_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUserUseCase>,
  ) {}

  @Post('login')
  async login(@Body() login: LoginDto): Promise<LoginUserResponse> {
    const user = await this.loginUsecaseProxy.getInstance().execute(login);
    if (!user) {
      throw new UnauthorizedException(
        "L'utilisateur n'a pas pu être connecté.",
      );
    }
    return user;
  }
}
