import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserByIdUseCase } from 'src/domaine/user/usecases/getUserById/getUserById.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetUserByIdDto } from './getUserById.dto';

@ApiTags('User')
@Controller('user')
export class GetUserByIdController {
  constructor(
    @Inject(UsecaseProxyModule.GET_USER_BY_ID_USECASE_PROXY)
    private readonly getUserByIdUseCase: UseCaseProxy<GetUserByIdUseCase>,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param() params: GetUserByIdDto) {
    return await this.getUserByIdUseCase
      .getInstance()
      .execute({ id: params.id });
  }
}
