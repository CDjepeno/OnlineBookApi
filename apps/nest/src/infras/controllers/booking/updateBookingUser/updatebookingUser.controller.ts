import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Inject,
  InternalServerErrorException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateBookingUserUseCase } from 'src/application/usecases/booking/updateBooking/updateBookingUser.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { UpdateBookingUserDto } from './bookingBook.dto';

@ApiTags('Booking')
@Controller('booking/user')
export class BookingBookController {
  constructor(
    @Inject(UsecaseProxyEnum.UPDATE_BOOKING_USER_USECASE_PROXY)
    private readonly updatebookingUserUsecaseProxy: UseCaseProxy<UpdateBookingUserUseCase>,
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update Booking User',
  })
  async bookingBook(@Body() UpdateBookingBookDto: UpdateBookingUserDto) {
    try {
      const result = await this.updatebookingUserUsecaseProxy
        .getInstance()
        .execute(UpdateBookingBookDto);

      return result;
    } catch (error) {
      console.error('Error occurred while update booking user:', typeof error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update booking user');
    }
  }
}
