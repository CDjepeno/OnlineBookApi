import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteBookUsecase } from 'src/application/usecases/book/deleteBook/deleteBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';

@ApiTags('Book')
@Controller('book')
export class DeleteBookController {
  constructor(
    @Inject(UsecaseProxyModule.DELETE_BOOK_USECASE_PROXY)
    private readonly deleteBookUsecaseProxy: UseCaseProxy<DeleteBookUsecase>,
  ) {}

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Book',
  })
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return await this.deleteBookUsecaseProxy.getInstance().execute(id);
  }
}
