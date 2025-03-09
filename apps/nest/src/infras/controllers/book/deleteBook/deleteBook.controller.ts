import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteBookUsecase } from 'src/application/usecases/book/deleteBook/deleteBook.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Book')
@Controller('book')
export class DeleteBookController {
  constructor(
    @Inject(UsecaseProxyEnum.DELETE_BOOK_USECASE_PROXY)
    private readonly deleteBookUsecaseProxy: UseCaseProxy<DeleteBookUsecase>,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete Book',
  })
  async deleteBook(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ msg: string }> {
    return this.deleteBookUsecaseProxy.getInstance().execute(id);
  }
}
