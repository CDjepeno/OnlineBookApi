import { ApiProperty } from '@nestjs/swagger';
import { GetAllBookDto } from './getAllBook.dto';

export class GetAllBookPaginationDto {
  @ApiProperty({ type: [GetAllBookDto] })
  books: GetAllBookDto[];

  @ApiProperty()
  totalBooks: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;
}
