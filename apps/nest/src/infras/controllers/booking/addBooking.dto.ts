import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Date de début de réservation',
    example: '2024-01-15T10:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date) // transforme string → Date
  @IsDate()
  startAt: Date;

  @ApiProperty({
    description: 'Date de fin de réservation',
    example: '2024-01-20T10:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endAt: Date;

  @ApiProperty({
    description: 'ID du livre à réserver',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  bookId: number;
}
