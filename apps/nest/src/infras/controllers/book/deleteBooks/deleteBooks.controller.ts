import { Body, Controller, Delete, Inject, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteBooksUsecase } from 'src/application/usecases/book/deleteBooks/deleteBooks.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { DeleteBooksDto } from './deleteBooks.dto';

@ApiTags('Book')
@Controller('books')
export class DeleteBooksController {
  constructor(
    @Inject(UsecaseProxyEnum.DELETE_BOOKS_USECASE_PROXY)
    private readonly deleteBooksUsecaseProxy: UseCaseProxy<DeleteBooksUsecase>,
  ) {}

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete several Books',
  })
  async deleteBooks(@Body() ids: DeleteBooksDto): Promise<void> {
    try {
      await this.deleteBooksUsecaseProxy.getInstance().execute(ids.ids);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException()
    }
  }
}
