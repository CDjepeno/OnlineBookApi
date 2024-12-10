import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllBookUsecase } from 'src/application/usecases/book/getAllBook/getAllBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { GetAllBookResponsePagination } from 'src/application/usecases/book/getAllBook/getAllBook.response';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Book')
@Controller('books')
export class GetAllBookController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_ALL_BOOK_USECASE_PROXY)
    private readonly getAllBookUsecaseProxy: UseCaseProxy<GetAllBookUsecase>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get first six Book',
  })
  async getAllBook(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '6',
  ): Promise<GetAllBookResponsePagination> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const {books, meta} = await this.getAllBookUsecaseProxy
        .getInstance()
        .execute(pageNumber, limitNumber);

      return { books, meta };
    } catch (error) {
      throw error;
    }
  }
}
