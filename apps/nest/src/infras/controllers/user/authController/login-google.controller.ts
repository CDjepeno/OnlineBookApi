import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { LoginGoogleResponse } from 'src/domaine/user/usecases/google/login.google.response';
import { LoginGoogleUseCase } from 'src/domaine/user/usecases/google/login.google.usecase';
import { GoogleAuthGuard } from 'src/infras/common/guards/google-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { LoginGoogleDto } from './login-google.dto';

@Controller('auth/google')
export class GoogleLoginController {
  constructor(
    @Inject(UsecaseProxyModule.LOGIN_GOOGLE_USECASE_PROXY)
    private readonly googleLoginUseCaseProxy: UseCaseProxy<LoginGoogleUseCase>,
  ) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Post('callback')
  async googleAuthRedirect(
    @Body() user: LoginGoogleDto,
  ): Promise<LoginGoogleResponse> {
    const result = await this.googleLoginUseCaseProxy
      .getInstance()
      .execute(user);
    return result;
  }
}
