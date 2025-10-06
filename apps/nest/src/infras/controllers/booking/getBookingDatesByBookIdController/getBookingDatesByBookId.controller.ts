import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBookingDatesByBookIdUseCase } from 'src/domaine/booking/usecases/getBookingDatesByBookId/getBookingDatesByBookId.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';

@ApiTags('Booking')
@Controller('books')
export class GetBookingDatesByBookIdController {
  constructor(
    @Inject(UsecaseProxyModule.GET_BOOKING_DATES_BY_BOOK_ID_USECASE_PROXY)
    private readonly getBookingDatesProxy: UseCaseProxy<GetBookingDatesByBookIdUseCase>,
  ) {}

  @Get(':bookId/bookings')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Recuperer les reservations d'un livre",
    description:
      'Retourne la liste des réservations associées à un livre (utile pour affichage calendrier)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des réservations récupérée avec succès',
    schema: {
      example: [
        {
          id: 1,
          startAt: '2025-10-01T10:00:00.000Z',
          endAt: '2025-10-05T10:00:00.000Z',
          userId: 12,
        },
      ],
    },
  })
  async getBookings(@Param('bookId', ParseIntPipe) bookId: number) {
    const result = await this.getBookingDatesProxy
      .getInstance()
      .execute({ bookId });
    console.log(result);
    return { data: result };
  }
}
