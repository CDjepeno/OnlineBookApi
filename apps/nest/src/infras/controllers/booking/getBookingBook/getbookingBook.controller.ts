import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookingsBookUseCase } from 'src/application/usecases/booking/getBookingsBook/getBookingsDates.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Booking')
@Controller('/bookings/book')
export class GetBookingBookController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOKINGS_BOOK_USECASE_PROXY)
    private readonly getBookingsBookUsecaseProxy: UseCaseProxy<GetBookingsBookUseCase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'get Bookings for a Book',
  })
  async getbookingsBook(@Param('id', ParseIntPipe) bookId: number) {
    return await this.getBookingsBookUsecaseProxy.getInstance().execute(bookId);
  }
}
