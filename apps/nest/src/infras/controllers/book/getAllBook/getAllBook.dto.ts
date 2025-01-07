

// export class GetAllBookDto {
//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   description: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   author: string;

//   @IsNotEmpty()
//   @IsDate()
//   @ApiProperty()
//   releaseAt: Date;

//   @IsNotEmpty()
//   @ApiProperty()
//   @IsUrl()
//   coverUrl: string;

//   @ApiProperty()
//   bookings?: string;
// }

export type GetAllBookDto = {
  name: string,
  description: string,
  author: string,
  releaseAt: string,
  coverUrl: string,
  userId: number,
  created_at: string,
  updated_at: string,
}