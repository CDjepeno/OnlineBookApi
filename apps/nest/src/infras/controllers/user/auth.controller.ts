import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/user/auth/login/login.user.usecase';
import { LogoutUserUseCase } from 'src/application/usecases/user/auth/logout/logout.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { AuthDto } from './auth.dto';
import { LogoutDto } from './logout.dto';
import { RefreshTokenUseCase } from 'src/application/usecases/user/auth/refreshToken/refresh.token.usecase';
import { RefreshTokenDto } from './refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyEnum.LOGIN_USER_USECASE_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUserUseCase>,

    @Inject(UsecaseProxyEnum.LOGOUT_USER_USECASE_PROXY)
    private readonly logoutUSeCaseProxy: UseCaseProxy<LogoutUserUseCase>,

    @Inject(UsecaseProxyEnum.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,

    @Inject(UsecaseProxyEnum.REFRESH_TOKEN_USECASE_PROXY)
   private readonly refreshTokenUseCase: UseCaseProxy<RefreshTokenUseCase>,
  
  )
  {}

  @Post('login')
  @ApiOperation({
    summary: 'Log a user',
  })
  async login(@Body() auth: AuthDto) {
    const user = await this.loginUsecaseProxy.getInstance().execute(auth);
    if (!user) {
      throw new UnauthorizedException(
        "L'utilisateur n'a pas pu être connecté.",
      );
    }
    return user;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
  })
  async logout(@Body() request: LogoutDto) {
    await this.logoutUSeCaseProxy.getInstance().execute(request);
  }

  @Get('current')
  @ApiOperation({
    summary: 'Get a current user',
  })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() request) {
    return await this.getCurrentUserUseCase
      .getInstance()
      .execute(request.user.email);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Get a current user',
  })
  async getRefreshToken(@Body() request: RefreshTokenDto) {
    return await this.refreshTokenUseCase
      .getInstance()
      .execute(request);
  }
}
