import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Titre du livre' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Description du livre' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Nom de l'auteur du livre" })
  author?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date de publication du livre' })
  releaseAt?: Date;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL de la couverture du livre' })
  coverUrl?: string;
}
