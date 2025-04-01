import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OAuthGoogleUseCase } from 'src/application/usecases/user/auth/OAuthGoogle/OAuthGoogle.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

export type credentialGoogleResponse = {
  credential: string,
  clientId: string,
  select_by: string
}

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyEnum.OAUTH_GOOGLE_USECASE_PROXY)
    private readonly oauthGoogleUsecaseProxy: UseCaseProxy<OAuthGoogleUseCase>,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Post('google/callback')
  async googleAuthRedirect(@Body() data: credentialGoogleResponse) {

    return this.oauthGoogleUsecaseProxy.getInstance().execute(data);
  }
}

