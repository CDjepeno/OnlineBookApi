import {
  Controller,
  Inject,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
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

  // @Get(':userId')
  @ApiOperation({
    summary: 'Get Books for current user',
  })
  @UseGuards(JwtAuthGuard)
  async getbooksByUser(@Req() req): Promise<GetBooksByUserDto[]> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('Token invalide ou manquant!');
    }
    return this.getBooksByUserUsecaseProxy.getInstance().execute(userId);
  }
}
