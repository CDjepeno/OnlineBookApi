import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    summary: 'Supprimer un livre par son identifiant',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Identifiant du livre à supprimer',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Livre supprimé avec succès',
  })
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return await this.deleteBookUsecaseProxy.getInstance().execute(id);
  }
}
