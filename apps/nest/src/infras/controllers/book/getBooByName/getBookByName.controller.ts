import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookByNameUsecase } from 'src/application/usecases/book/getBookByName/getBookByName.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { GetBookByNameDto } from './getBookByName.dto';

@ApiTags('Book')
@Controller('book')
export class GetBookByNameController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOK_BY_NAME_USECASE_PROXY)
    private readonly getBookByNameUsecaseProxy: UseCaseProxy<GetBookByNameUsecase>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Book by name',
  })
  async getBookByName(
    @Query('name') nameBook: string,
  ): Promise<GetBookByNameDto> {
    return this.getBookByNameUsecaseProxy.getInstance().execute(nameBook);
  }
}
