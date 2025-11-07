import { ApiProperty } from '@nestjs/swagger';

export class GetBookingsByUserDto {
  @ApiProperty({ example: 14 })
  bookingId: number;

  @ApiProperty({ example: 1 })
  bookId: number;

  @ApiProperty({ example: 'LA romance blanche' })
  title: string;

  @ApiProperty({
    example: 'https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/ubu.jpeg',
  })
  coverUrl: string;

  @ApiProperty({ example: '2024-12-17T00:00:00.000Z' })
  startAt: Date;

  @ApiProperty({ example: '2024-12-21T00:00:00.000Z' })
  endAt: Date;

  @ApiProperty({ example: true })
  hasFutureReservation: boolean;
}
