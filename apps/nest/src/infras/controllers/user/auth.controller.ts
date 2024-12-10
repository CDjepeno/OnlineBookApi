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

import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/user/getuser/login.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { AuthDto } from './auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyEnum.LOGIN_USER_USECASE_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUserUseCase>,
    @Inject(UsecaseProxyEnum.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,
  ) {}

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
}
