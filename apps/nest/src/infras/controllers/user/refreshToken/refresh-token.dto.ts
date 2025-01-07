import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly refreshToken!: string;

}