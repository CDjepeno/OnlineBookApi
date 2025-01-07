import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nom du livre' })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'The email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description du livre' })
  sexe!: string;

  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-_]).{8,}$/, {
    message: 'Password should have 1 upper case, 1 lowercase letter, 1 number, and 1 special character.',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'URL de la couverture du livre' })
  phone!: string;
}
