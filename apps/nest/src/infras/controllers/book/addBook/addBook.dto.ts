import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  releaseAt: Date;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsOptional() 
  coverUrl?: Express.Multer.File;
}
