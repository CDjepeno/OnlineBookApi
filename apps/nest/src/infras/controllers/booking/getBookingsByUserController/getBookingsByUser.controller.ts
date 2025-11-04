import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBookingsByUserUseCase } from 'src/domaine/booking/usecases/getBookingsByUser/getBookingsByUser.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { GetBookingsByUserDto } from './getBookingsByUser.dto';

@ApiTags('Booking')
@Controller('bookings')
export class GetBookingsByUserController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOKINGS_BY_USER_USECASE_PROXY)
    private readonly getBookingsByUserProxy: UseCaseProxy<GetBookingsByUserUseCase>,
  ) {}

  @Get('user/:userId')
  @ApiOperation({
    summary: "Récupérer les livres réservés d'un utilisateur",
    description:
      "Retourne la liste des réservations d'un utilisateur, incluant les dates de début et de fin, ainsi que l'indication si le livre a une réservation future ou en cours (hasFutureReservation).",
  })
  @ApiResponse({
    status: 200,
    description: 'Réservations récupérées avec succès',
    type: GetBookingsByUserDto,
    isArray: true,
  })
  async getBookingByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.getBookingsByUserProxy.getInstance().execute(userId);
  }
}
