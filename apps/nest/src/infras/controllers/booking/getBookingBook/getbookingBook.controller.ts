import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookingsDatesByBookUseCase } from 'src/application/usecases/booking/getBookingsBook/getBookingsDates.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Booking')
@Controller('/bookings/book')
export class GetBookingBookController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOKINGS_DATES_BY_BOOK_USECASE_PROXY)
    private readonly getBookingsDatesByBookUsecaseProxy: UseCaseProxy<GetBookingsDatesByBookUseCase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'get Bookings for a Book',
  })
  async getbookingsBook(@Param('id', ParseIntPipe) bookId: number) {
    return await this.getBookingsDatesByBookUsecaseProxy
      .getInstance()
      .execute(bookId);
  }
}
