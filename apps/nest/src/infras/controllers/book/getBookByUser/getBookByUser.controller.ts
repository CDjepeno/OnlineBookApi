import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetBooksByUserUsecase } from 'src/domaine/book/usecases/getBooksByUser/getBooksByUser.usecase';
import { CurrentUser } from 'src/infras/common/decorators/urrent-user.decorator';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBooksByUserDto } from './getBooksByUser.dto';

@Controller('books')
export class GetBookByUserController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY)
    private readonly getBooksByUserUsecaseProxy: UseCaseProxy<GetBooksByUserUsecase>,
  ) {}

  @Get(':userId')
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
  async getbooksByUser(
    @CurrentUser('id') userId: number,
  ): Promise<GetBooksByUserDto[]> {
    return this.getBooksByUserUsecaseProxy.getInstance().execute(userId);
  }
}
