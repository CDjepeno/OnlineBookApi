import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nom du livre' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description du livre' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Nom de l'auteur du livre" })
  author: string;

  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ description: 'URL de la couverture du livre' })
  coverUrl?: string;
}
