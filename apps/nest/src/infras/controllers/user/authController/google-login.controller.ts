import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { LoginGoogleResponse } from 'src/domaine/user/usecases/google/login.google.response';
import { LoginGoogleUseCase } from 'src/domaine/user/usecases/google/login.google.usecase';
import { GoogleUser } from 'src/infras/common/decorators/google-user.decorator';
import { GoogleAuthGuard } from 'src/infras/common/guards/google-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GoogleLoginDto } from './google-login.dto';

@Controller('auth/google')
export class GoogleLoginController {
  constructor(
    @Inject(UsecaseProxyModule.LOGIN_GOOGLE_USECASE_PROXY)
    private readonly googleLoginUseCaseProxy: UseCaseProxy<LoginGoogleUseCase>,
  ) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Nest redirige vers Google OAuth
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @GoogleUser() user: GoogleLoginDto,
  ): Promise<LoginGoogleResponse> {
    console.log('Google user:', user);
    return await this.googleLoginUseCaseProxy.getInstance().execute(user);
  }
}
