import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sexe!: string;
}
