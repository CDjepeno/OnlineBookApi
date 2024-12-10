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
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { GetBooksByUserDto } from './getBooksByUser.dto';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Book')
@Controller('books')
export class GetBookByUserController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOKS_BY_USER_USECASE_PROXY)
    private readonly getBooksByUserUsecaseProxy: UseCaseProxy<GetBooksByUserUsecase>,
  ) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get Books by userId',
  })
  async getbooksByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetBooksByUserDto[]> {
    try {
      const books = this.getBooksByUserUsecaseProxy
        .getInstance()
        .execute(userId);
      if (!books) {
        throw new NotFoundException(
          `Aucun livre trouve pour l'utilisateur avec l'userId ${userId}`,
        );
      }
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Impossible de récupérer les livres.',
        );
      }
    }
  }
}
