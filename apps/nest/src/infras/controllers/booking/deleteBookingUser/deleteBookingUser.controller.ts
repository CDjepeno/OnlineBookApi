import {
  Controller,
  Delete,
  Inject,
  InternalServerErrorException,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteBookingUserUsecase } from 'src/application/usecases/booking/deleteBookingUser/deleteBookingUser.usecase';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { DeleteBookingUserResponse } from '../../../../application/usecases/booking/deleteBookingUser/deleteBookingUser.response';

@ApiTags('Booking')
@Controller('booking/user')
export class DeleteBooksController {
  constructor(
    @Inject(UsecaseProxyEnum.DELETE_BOOKING_USER_USECASE_PROXY)
    private readonly deleteBookingUserUsecaseProxy: UseCaseProxy<DeleteBookingUserUsecase>,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete Booking user',
  })
  async deleteBookingUser(@Param() id: number): Promise<DeleteBookingUserResponse> {
    try {
      return await this.deleteBookingUserUsecaseProxy.getInstance().execute(id);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
