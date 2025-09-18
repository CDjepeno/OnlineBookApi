import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginGoogleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly id?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: true, description: 'ID Token Google côté frontend' })
  @IsNotEmpty()
  @IsString()
  readonly idToken: string;
}
