import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllBookUsecase } from 'src/domaine/book/usecases/getAllBook/getAllBook.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetAllBookPaginationDto } from './getAllBookPagination.dto';

@ApiTags('Book')
@Controller('books')
export class GetAllBookController {
  constructor(
    @Inject(UsecaseProxyModule.GET_ALL_BOOK_USECASE_PROXY)
    private readonly getAllBookUsecaseProxy: UseCaseProxy<GetAllBookUsecase>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des livres avec pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 6 })
  @ApiResponse({
    status: 200,
    description: 'Liste des livres paginée avec succès',
    type: GetAllBookPaginationDto,
  })
  async getAllBook(
    @Query('page') page = 1,
    @Query('limit') limit = 6,
  ): Promise<GetAllBookPaginationDto> {
    const result = await this.getAllBookUsecaseProxy
      .getInstance()
      .execute(page, limit);

    const { books, meta } = result;

    return {
      books: books.map((b) => ({
        title: b.title,
        description: b.description,
        author: b.author,
        releaseAt: b.releaseAt,
        coverUrl: b.coverUrl,
      })),
      totalBooks: meta.totalBooks,
      currentPage: meta.currentPage,
      totalPages: meta.totalPages,
    };
  }
}
