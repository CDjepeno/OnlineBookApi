import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { BookingBookUseCase } from 'src/application/usecases/booking/bookingBook/bookingBook.usecase';
import { BookingBookDto } from './bookingBook.dto';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Booking')
@Controller('booking/book')
export class BookingBookController {
  constructor(
    @Inject(UsecaseProxyEnum.BOOKING_BOOK_USECASE_PROXY)
    private readonly bookingBookUsecaseProxy: UseCaseProxy<BookingBookUseCase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverUrl'))
  @ApiOperation({
    summary: 'Booking Book',
  })
  async bookingBook(
    @Body() BookingBookDto: BookingBookDto,
  ) {
    try {
      
      const result = await this.bookingBookUsecaseProxy
        .getInstance()
        .execute(BookingBookDto);

      return result;
    } catch (error) {
      console.error('Error occurred while booking book:', typeof error);
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
     
      throw new InternalServerErrorException('Failed to booking book');
    }
  }
}
