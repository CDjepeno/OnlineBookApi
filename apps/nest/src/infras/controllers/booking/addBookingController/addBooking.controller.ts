import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddBookingRequest } from 'src/domaine/booking/usecases/addBooking/addBooking.request';
import { AddBookingUseCase } from 'src/domaine/booking/usecases/addBooking/addBooking.usecase';
import { CurrentUser } from 'src/infras/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infras/usecase-proxy/usecase-proxy.module';
import { CreateBookingDto } from './addBooking.dto';

@ApiTags('Booking')
@Controller('Booking')
export class AddBookingController {
  constructor(
    @Inject(UsecaseProxyModule.ADD_BOOKING_USECASE_PROXY)
    private readonly addBookingUsecaseProxy: UseCaseProxy<AddBookingUseCase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Réserver un livre',
    description: 'Permet de réserver un livre pour une période donnée',
  })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès',
    type: CreateBookingDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (dates incorrectes)',
    schema: {
      example: {
        statusCode: 400,
        message: 'La date de début doit être antérieure à la date de fin.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Livre non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: "Le livre avec l'ID 1 n'existe pas.",
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Livre déjà réservé pour cette période',
    schema: {
      example: {
        statusCode: 409,
        message: 'Le livre est déjà réservé pour cette période.',
        error: 'Conflict',
      },
    },
  })
  async addBooking(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser('id') userId: number,
  ) {
    const request: AddBookingRequest = {
      startAt: createBookingDto.startAt,
      endAt: createBookingDto.endAt,
      bookId: createBookingDto.bookId,
      userId,
    };
    const result = await this.addBookingUsecaseProxy
      .getInstance()
      .execute(request);

    return { data: result };
  }
}
