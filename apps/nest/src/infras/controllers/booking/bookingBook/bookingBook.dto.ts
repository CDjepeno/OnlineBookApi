import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class BookingBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  bookId!: number;

  @ApiProperty()
  @IsNotEmpty()
  createdAt!: Date;

  @ApiProperty()
  @IsNotEmpty()
  startAt!: Date;

  @ApiProperty()
  @IsNotEmpty()
  endAt!: Date;

  @IsNotEmpty()
  @IsInt()
  userId!: number;
}
