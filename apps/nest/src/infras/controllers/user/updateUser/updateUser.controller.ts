import { Body, Controller, Inject, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserUseCase } from 'src/domaine/user/usecases/updateuser/update.user.usecase';
import { CurrentUser } from 'src/infras/common/decorators/current-user.decorator';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './updateUser.dto';

@ApiTags('user')
@Controller('user')
export class UpdateUserController {
  constructor(
    @Inject(UsecaseProxyModule.UPDATE_USER_USECASE_PROXY)
    private readonly updateUserUsecaseProxy: UseCaseProxy<UpdateUserUseCase>,
  ) {}

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mettre à jour un profile',
    description:
      'Permet à un utilisateur authentifié de mettre à jour son propre profil. Au moins un champ doit être fourni.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile mis a jour avec succès',
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou aucun champ fourni',
    schema: {
      example: {
        statusCode: 400,
        message: 'Au moins un champ doit être fourni pour la mise à jour',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT manquant ou invalide',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Utilisateur introuvable',
    schema: {
      example: {
        statusCode: 404,
        message: "L'utilisateur n'existe pas",
        error: 'Not Found',
      },
    },
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { sub: number; email: string },
  ) {
    const result = await this.updateUserUsecaseProxy
      .getInstance()
      .execute({ ...updateUserDto, id: currentUser.sub });

    return { data: result };
  }
}
