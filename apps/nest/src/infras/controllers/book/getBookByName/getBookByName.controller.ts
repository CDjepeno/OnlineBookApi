import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetBookByNameUsecase } from 'src/domaine/book/usecases/getBookByName/getBookByName.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBookByNameDTO } from './getBookByName.dto';

@Controller('search')
export class GetBookByNameController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOK_BY_NAME_USECASE_PROXY)
    private readonly getBookByNameUsecaseProxy: UseCaseProxy<GetBookByNameUsecase>,
  ) {}
  @Get()
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
    type: [GetBookByNameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun livre trouvé pour ce titre',
  })
  async getBooksByName(
    @Query('name') name: string,
  ): Promise<GetBookByNameDTO[]> {
    return this.getBookByNameUsecaseProxy.getInstance().execute(name);
  }
}
