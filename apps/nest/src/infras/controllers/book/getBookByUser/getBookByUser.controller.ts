import {
  Controller,
  Inject,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBooksByUserDto } from './getBooksByUser.dto';
import { GetBooksByUserUsecase } from 'src/domaine/book/usecases/getBooksByUser/getBooksByUser.usecase';

@Controller('books')
export class GetBookByUserController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY)
    private readonly getBooksByUserUsecaseProxy: UseCaseProxy<GetBooksByUserUsecase>,
  ) {}

  @ApiOperation({
    summary: "Récupérer les livres de l'utilisateur connecté",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Liste des livres de l’utilisateur',
    type: GetBooksByUserDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  async getbooksByUser(@Req() req): Promise<GetBooksByUserDto[]> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException(
        'Token invalide ou utilisateur non authentifié',
      );
    }
    return this.getBooksByUserUsecaseProxy.getInstance().execute(userId);
  }
}
