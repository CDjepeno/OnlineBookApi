import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetAllBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  author: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  releaseAt: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsUrl()
  coverUrl: string;
}

