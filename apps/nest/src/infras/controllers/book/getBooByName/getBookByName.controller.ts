import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { GetBookByNameDto } from './getBookByName.dto';
import { GetBookByNameUsecase } from 'src/application/usecases/book/getBookByName/getBookByName.usecase';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

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
  async getBookByName(@Query('name') nameBook: string): Promise<GetBookByNameDto> {
    try {
      const book = await this.getBookByNameUsecaseProxy.getInstance().execute(nameBook);
      if (!book) {
        throw new NotFoundException(`Aucun livre trouvé avec le nom "${nameBook}"`);
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
