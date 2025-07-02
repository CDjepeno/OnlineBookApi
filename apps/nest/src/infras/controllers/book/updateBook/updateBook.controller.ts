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
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBookUseCase } from 'src/domaine/book/usecases/updateBook/updateBook.usecase';
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Mettre a jour un livre',
  })
  @ApiResponse({
    status: 200,
    description: 'Livre mis à jour avec succès',
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
          exceptionFactory: () => new BadRequestException('Fichier invalide'),
        }),
    )
    coverFile?: Express.Multer.File,
  ) {
    const result = await this.updateUsecaseProxy
      .getInstance()
      .execute({ ...updateBookDto, id, coverUrl: coverFile });
    return {
      data: result,
    };
  }
}
