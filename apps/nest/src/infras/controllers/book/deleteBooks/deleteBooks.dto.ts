import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBooksDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ids des différents livre a supprimer' })
  ids!: string[];
}
