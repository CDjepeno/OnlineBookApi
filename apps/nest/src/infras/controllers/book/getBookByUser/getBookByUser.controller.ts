import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBooksByUserPaginationResponse } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.response';
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Book')
@Controller('books')
export class GetBookByUserController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOKS_BY_USER_USECASE_PROXY)
    private readonly getBooksByUserUsecaseProxy: UseCaseProxy<GetBooksByUserUsecase>,
  ) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get Books by userId',
  })
  async getbooksByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '6',
  ): Promise<GetBooksByUserPaginationResponse> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const { books, pagination } = await this.getBooksByUserUsecaseProxy
        .getInstance()
        .execute(userId, pageNumber, limitNumber);
      if (!books) {
        throw new NotFoundException(
          `Aucun livre trouve pour l'utilisateur avec l'userId ${userId}`,
        );
      }
      return {books, pagination};
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Impossible de récupérer les livres.',
        );
      }
    }
  }
}
