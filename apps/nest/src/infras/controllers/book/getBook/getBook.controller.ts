import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBookUsecase } from 'src/application/usecases/book/getBook/getBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBookDto } from './getBook.dto';

@ApiTags('Book')
@Controller('book')
export class GetBookController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOK_USECASE_PROXY)
    private readonly getBookUsecaseProxy: UseCaseProxy<GetBookUsecase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un livre par son identifiant',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identifiant du livre à récupérer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Livre trouvé avec succès',
    type: GetBookDto,
  })
  async getBook(@Param('id', ParseIntPipe) id: number): Promise<GetBookDto> {
    return await this.getBookUsecaseProxy.getInstance().execute(id);
  }
}
