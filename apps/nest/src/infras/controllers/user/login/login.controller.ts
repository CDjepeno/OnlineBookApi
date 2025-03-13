import { Body, Controller, Inject, Post } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from 'src/application/usecases/user/auth/login/login.user.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { LoginDto } from './login.dto';

@ApiTags('User')
@Controller('auth')
export class LoginController {
  constructor(
    @Inject(UsecaseProxyEnum.LOGIN_USER_USECASE_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUserUseCase>,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Log a user',
  })
  async login(@Body() auth: LoginDto) {
    return await this.loginUsecaseProxy.getInstance().execute(auth);
  }
}
