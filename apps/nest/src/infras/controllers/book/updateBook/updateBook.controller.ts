import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
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
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { UpdateBookDto } from './updateBook.dto';

@ApiTags('Book')
@Controller('book')
export class UpdateBookController {
  constructor(
    @Inject(UsecaseProxyEnum.UPDATE_BOOK_USECASE_PROXY)
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
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    coverUrl: Express.Multer.File,
  ) {
    if (!coverUrl && !updateBookDto.coverUrl) {
      throw new BadRequestException('Cover fileeeeee is required');
    }

    const dataToUpdate = { ...updateBookDto, id, coverUrl };

    return await this.updateUsecaseProxy.getInstance().execute(dataToUpdate);
  }
}
