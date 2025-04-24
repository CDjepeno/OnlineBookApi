import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
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
    summary: 'Get Books by userId',
  })
  async getbooksByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetBooksByUserDto[]> {
    return this.getBooksByUserUsecaseProxy.getInstance().execute(userId);
  }
}
