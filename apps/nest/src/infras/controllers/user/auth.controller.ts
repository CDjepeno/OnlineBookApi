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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/user/getuser/login.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { AuthDto } from './auth.dto';

@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyModule.LOGIN_USER_USECASE_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUserUseCase>,
    @Inject(UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les infos de l’utilisateur courant' })
  @ApiResponse({ status: 200, description: 'Utilisateur courant trouvé' })
  async getCurrentUser(@Req() request) {
    const email = request.user.email;
    if (!email) {
      throw new UnauthorizedException('Token invalide ou manquant!');
    }

    return await this.getCurrentUserUseCase.getInstance().execute(email);
  }
}
