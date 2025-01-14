import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBookingsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ids des différentes reservation a supprimer' })
  ids!: string[];
}
