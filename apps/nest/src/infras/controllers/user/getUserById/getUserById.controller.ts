import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserByIdUseCase } from 'src/application/usecases/user/GetUserById/get.user_by_id.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('User')
@Controller('user')
export class GetUserByIdController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_USER_BY_ID_USECASE_PROXY)
    private readonly getUserByIdUseCase: UseCaseProxy<GetUserByIdUseCase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) idUser: number) {
    return await this.getUserByIdUseCase.getInstance().execute(+idUser);
  }
}
