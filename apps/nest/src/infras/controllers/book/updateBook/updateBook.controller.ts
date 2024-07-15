import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateBookUseCase } from 'src/application/usecases/book/updateBook/updateBook.usecase';
import { badrequestexception } from 'src/domaine/errors/book.error';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { UpdateBookDto } from './updateBook.dto';

@ApiTags('Book')
@Controller('book')
export class UpdateBookController {
  constructor(
    @Inject(UsecaseProxyModule.UPDATE_BOOK_USECASE_PROXY)
    private readonly updateUsecaseProxy: UseCaseProxy<UpdateBookUseCase>,
  ) {}

  @Put(':id')
  @UseInterceptors(FileInterceptor('coverUrl'))
  @ApiOperation({
    summary: 'Update Book',
  })
  async updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /.(png|jpe?g)$/ })
        .addMaxSizeValidator({ maxSize: 3 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    coverFile: Express.Multer.File,
  ) {
    try {
      if (!coverFile && !updateBookDto.coverUrl) {
        throw new BadRequestException('Cover file is required');
      }

      const result = await this.updateUsecaseProxy
        .getInstance()
        .execute({ ...updateBookDto, id, coverUrl: coverFile });

      const { name, description, author, releaseAt, coverUrl } = result;

      return {
        name,
        description,
        author,
        releaseAt,
        coverUrl,
      };
    } catch (error) {
      console.error('Error occurred while updating book:', error);

      if (error instanceof badrequestexception) {
        throw new badrequestexception(error.message);
      }
      throw new InternalServerErrorException('Failed to update book');
    }
  }
}
