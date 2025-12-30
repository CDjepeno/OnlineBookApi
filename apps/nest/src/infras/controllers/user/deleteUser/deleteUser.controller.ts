import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteUserUseCase } from 'src/domaine/user/usecases/deleteuser/delete.user.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from '../../../usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from '../../../usecase-proxy/usecase-proxy.module';

@ApiTags('User')
@Controller('users')
export class DeleteUserController {
  constructor(
    @Inject(UsecaseProxyModule.DELETE_USER_USECASE_PROXY)
    private readonly deleteUserUsecaseProxy: UseCaseProxy<DeleteUserUseCase>,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteUserUsecaseProxy.getInstance().execute(id);

    return {
      data: result,
    };
  }
}
