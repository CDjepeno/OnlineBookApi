import { Body, Controller, Inject, Post } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenUseCase } from 'src/application/usecases/user/auth/refreshToken/refresh.token.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { RefreshTokenDto } from './refresh-token.dto';

@ApiTags('User')
@Controller('auth')
export class RefreshTokenController {
  constructor(
    @Inject(UsecaseProxyEnum.REFRESH_TOKEN_USECASE_PROXY)
    private readonly refreshTokenUseCase: UseCaseProxy<RefreshTokenUseCase>,
  ) {}

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Get a refresh-token',
  })
  async getRefreshToken(@Body() request: RefreshTokenDto) {
    return await this.refreshTokenUseCase.getInstance().execute(request);
  }
}
