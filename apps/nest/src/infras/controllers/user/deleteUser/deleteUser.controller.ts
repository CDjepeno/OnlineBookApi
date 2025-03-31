import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserUsecase } from 'src/application/usecases/user/deleteUser/delete.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('User')
@Controller('user')
export class DeleteUserController {
  constructor(
    @Inject(UsecaseProxyEnum.DELETE_USER_USECASE_PROXY)
    private readonly deleteUserUsecaseProxy: UseCaseProxy<DeleteUserUsecase>,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete User',
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ msg: string }> {
    return this.deleteUserUsecaseProxy.getInstance().execute(id);
  }
}
