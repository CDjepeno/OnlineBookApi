import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBookingUserDto {
  @ApiProperty()
  @IsNotEmpty()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  startAt!: string;

  @ApiProperty()
  @IsNotEmpty()
  endAt!: string;
}
