import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetBookingBookDto {
  @ApiProperty()
  @IsNotEmpty()
  startAt!: Date;

  @ApiProperty()
  @IsNotEmpty()
  endAt!: Date;
}
