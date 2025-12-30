import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Sexe } from 'src/domaine/enums/sexe.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Nom complet de l'utilisateur",
    example: 'Jean Dupont',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "Email de l'utilisateur",
    example: 'jean.dupont@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: "Mot de passe de l'utilisateur (min 6, max 24 caractères)",
    example: 'Password123!',
  })
  @IsString()
  @IsOptional()
  @Length(6, 24)
  @Matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-_]).{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  password?: string;

  @ApiPropertyOptional({
    description: "Numéro de téléphone de l'utilisateur (format français)",
    example: '0612345678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Sexe de l'utilisateur",
    enum: Sexe,
    example: Sexe.HOMME,
  })
  @IsEnum(Sexe)
  @IsOptional()
  sexe?: Sexe;
}
