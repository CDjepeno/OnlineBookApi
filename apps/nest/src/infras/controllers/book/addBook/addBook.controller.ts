import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddBookUseCase } from 'src/application/usecases/book/addBook/addBook.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { CreateBookDto } from './addBook.dto';

@ApiTags('Book')
@Controller('book')
export class AddBookController {
  constructor(
    @Inject(UsecaseProxyModule.ADD_BOOK_USECASE_PROXY)
    private readonly addBookUsecaseProxy: UseCaseProxy<AddBookUseCase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverUrl'))
  @ApiOperation({
    summary: 'Create Book',
  })
  async addBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /.(png|jpe?g)$/ })
        .addMaxSizeValidator({ maxSize: 3 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    coverUrl: Express.Multer.File,
  ) {
    if (!coverUrl) {
      throw new BadRequestException('Cover file is required to create book');
    }

    const result = await this.addBookUsecaseProxy
      .getInstance()
      .execute({ ...createBookDto, coverUrl });

    return { data: result };
  }
}
