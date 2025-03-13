import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookUsecase } from 'src/application/usecases/book/getBook/getBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { GetBookDto } from './getBook.dto';

@ApiTags('Book')
@Controller('book')
export class GetBookController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOK_USECASE_PROXY)
    private readonly getBookUsecaseProxy: UseCaseProxy<GetBookUsecase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get Book by Id',
  })
  async getBook(@Param('id', ParseIntPipe) id: number): Promise<GetBookDto> {
    return await this.getBookUsecaseProxy.getInstance().execute(id);
  }
}
