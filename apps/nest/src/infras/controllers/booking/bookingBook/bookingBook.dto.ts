import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  title?: string;
  
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsInt()
  userId!: number;
}
