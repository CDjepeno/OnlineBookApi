import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LogoutDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly id: number;

}