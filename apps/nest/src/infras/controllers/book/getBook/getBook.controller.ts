import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookUsecase } from 'src/application/usecases/book/getBook/getBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { GetBookDto } from './getBook.dto';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

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
    try {
      const book = await this.getBookUsecaseProxy.getInstance().execute(id);
      if (!book) {
        throw new NotFoundException(`Aucun livre trouvé avec le nom "${id}"`);
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Impossible de récupérer le livre.',
        );
      }
    }
  }
}
