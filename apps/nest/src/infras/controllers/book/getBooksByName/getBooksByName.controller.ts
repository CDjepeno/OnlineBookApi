import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetBooksByNameUsecase } from 'src/domaine/book/usecases/getBooksByName/getBooksByName.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBooksByNameDTO } from './getBooksByName.dto';

@Controller('books')
export class GetBooksByNameController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOKS_BY_NAME_USECASE_PROXY)
    private readonly getBooksByNameUsecaseProxy: UseCaseProxy<GetBooksByNameUsecase>,
  ) {}
  @Get('search')
  @ApiOperation({ summary: 'Rechercher des livres par titre' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Nom ou partie du titre du livre à rechercher',
    example: 'Le Petit Prince',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livres trouvés',
    type: [GetBooksByNameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun livre trouvé pour ce titre',
  })
  async getBooksByName(
    @Query('name') name: string,
  ): Promise<GetBooksByNameDTO[]> {
    return this.getBooksByNameUsecaseProxy.getInstance().execute(name);
  }
}
