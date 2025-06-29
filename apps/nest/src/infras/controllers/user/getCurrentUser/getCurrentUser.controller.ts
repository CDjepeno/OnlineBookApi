import {
  Controller,
  Get,
  Inject,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/get.current.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetCurrentUserDto } from './getCurrentUser.dto';

@Controller('auth')
export class GetCurrentUserController {
  constructor(
    @Inject(UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,
  ) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() request): Promise<GetCurrentUserDto> {
    const email = request.user.email;
    if (!email) {
      throw new UnauthorizedException('Token invalide ou manquant!');
    }

    return await this.getCurrentUserUseCase.getInstance().execute(email);
  }
}
