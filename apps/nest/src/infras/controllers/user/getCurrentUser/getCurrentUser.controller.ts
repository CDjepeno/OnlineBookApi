import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserUseCase } from 'src/domaine/user/usecases/auth/get.current.user.usecase';
import { CurrentUser } from 'src/infras/common/decorators/urrent-user.decorator';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetCurrentUserDto } from './getCurrentUser.dto';

@ApiTags('User')
@Controller('auth')
export class GetCurrentUserController {
  constructor(
    @Inject(UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,
  ) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() user: { email: string },
  ): Promise<GetCurrentUserDto> {
    const email = user.email;

    return await this.getCurrentUserUseCase.getInstance().execute(email);
  }
}
