import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/GetCurrentUser/get.current.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { GetCurrentUserDto } from './getCurrentUser.dto';

@ApiTags('User')
@Controller('auth')
export class GetCurrentUserController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_CURRENT_USER_USECASE_PROXY)
    private readonly getCurrentUserUseCase: UseCaseProxy<GetCurrentUserUseCase>,
  ) {}

  @Get('current')
  @ApiOperation({
    summary: 'Get a current user',
  })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() request: GetCurrentUserDto) {
    return await this.getCurrentUserUseCase
      .getInstance()
      .execute(request.email);
  }
}
