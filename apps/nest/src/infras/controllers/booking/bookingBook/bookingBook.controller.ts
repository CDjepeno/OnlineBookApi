import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingBookUseCase } from 'src/application/usecases/booking/bookingBook/bookingBook.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { BookingBookDto } from './bookingBook.dto';

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
  async bookingBook(@Body() BookingBookDto: BookingBookDto) {
    return await this.bookingBookUsecaseProxy
      .getInstance()
      .execute(BookingBookDto);
  }
}
