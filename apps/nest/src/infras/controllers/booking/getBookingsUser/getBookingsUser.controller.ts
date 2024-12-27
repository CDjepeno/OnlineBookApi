import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  async getbookingsBook(@Param('id', ParseIntPipe) userId: number) {
    try {
      return await this.getBookingsUserUsecaseProxy
        .getInstance()
        .execute(userId);
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
