import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBookingsByUserUseCase } from 'src/domaine/booking/usecases/getBookingsByUser/getBookingsByUser.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';

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
      "Retourne la liste des réservations d'un utilisateur avec la date et l'état futur de réservation",
  })
  @ApiResponse({
    status: 200,
    description: 'Réservations récupérées avec succès',
    schema: {
      example: [
        {
          bookingId: 14,
          bookId: 1,
          title: 'LA romance blanche',
          coverUrl:
            'https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/ubu.jpeg',
          startAt: '2024-12-17T00:00:00.000Z',
          endAt: '2024-12-21T00:00:00.000Z',
          hasFutureReservation: true,
        },
      ],
    },
  })
  async getBookingByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.getBookingsByUserProxy.getInstance().execute(userId);
  }
}
