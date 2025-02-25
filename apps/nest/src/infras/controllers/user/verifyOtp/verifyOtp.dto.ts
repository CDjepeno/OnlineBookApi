import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  readonly otp!: string;
}
