import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Sexe } from 'src/domaine/enums/sexe.enum';

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @ApiProperty({
    enum: Sexe,
    example: Sexe.HOMME,
    required: false,
    description: "Le sexe de l'utilisateur",
  })
  @IsEnum(Sexe)
  @IsOptional()
  sexe: Sexe;
}
