import {
  Body,
  Controller,
  Delete,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteBookingsUserResponse } from 'src/application/usecases/booking/deleteBookingssUser/deleteBookingsUser.response';
import { DeleteBookingsUserUsecase } from 'src/application/usecases/booking/deleteBookingssUser/deleteBookingsUser.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { DeleteBookingsDto } from './deleteBookings.dto';

@ApiTags('Booking')
@Controller('bookings/user')
export class DeleteBookingsController {
  constructor(
    @Inject(UsecaseProxyEnum.DELETE_BOOKINGS_USER_USECASE_PROXY)
    private readonly deleteBookingsUserUsecaseProxy: UseCaseProxy<DeleteBookingsUserUsecase>,
  ) {}

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete Bookings user',
  })
  async deleteBookingsUser(
    @Body() data: DeleteBookingsDto,
  ): Promise<DeleteBookingsUserResponse> {
    try {
      console.log(typeof data.ids[0]);
      
      return await this.deleteBookingsUserUsecaseProxy
        .getInstance()
        .execute(data.ids);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
