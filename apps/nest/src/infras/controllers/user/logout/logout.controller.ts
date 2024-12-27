import { Body, Controller, Inject, Post } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogoutUserUseCase } from 'src/application/usecases/user/auth/logout/logout.user.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { LogoutDto } from './logout.dto';

@ApiTags('User')
@Controller('auth')
export class LogoutController {
  constructor(
    @Inject(UsecaseProxyEnum.LOGOUT_USER_USECASE_PROXY)
    private readonly logoutUSeCaseProxy: UseCaseProxy<LogoutUserUseCase>,
  ) {}

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
  })
  async logout(@Body() request: LogoutDto) {
    await this.logoutUSeCaseProxy.getInstance().execute(request);
  }
}
