import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBookingUserPaginationResponse } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.response';
import { GetBookingsUserUseCase } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Booking')
@Controller('/bookings/user')
export class GetBookingUserController {
  constructor(
    @Inject(UsecaseProxyEnum.GET_BOOKINGS_USER_USECASE_PROXY)
    private readonly getBookingsUserUsecaseProxy: UseCaseProxy<GetBookingsUserUseCase>,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'get Bookings for a User',
  })
  async getbookingsBook(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '6',
  ): Promise<GetBookingUserPaginationResponse> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
 
      const {bookings, pagination} = await this.getBookingsUserUsecaseProxy
        .getInstance()
        .execute(userId, pageNumber,limitNumber);

      return {
        bookings,
        pagination
      }
    } catch (error) {
      console.error('Error occurred while getbooking user:', typeof error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to booking book');
    }
  }
}
