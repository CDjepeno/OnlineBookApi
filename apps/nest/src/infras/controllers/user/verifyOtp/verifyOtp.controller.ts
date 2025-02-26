import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOtpUseCase } from 'src/application/usecases/user/auth/verifyOtp/VerifyOtp.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { VerifyOtpDto } from './verifyOtp.dto';

@ApiTags('User')
@Controller('auth')
export class LoginController {
  constructor(
    @Inject(UsecaseProxyEnum.VERIFY_OTP)
    private readonly verifyOtpUsecaseProxy: UseCaseProxy<VerifyOtpUseCase>,
  ) {}

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify a otp',
  })
  async verifyOtp(@Body() req: VerifyOtpDto) {
    try {
      return await this.verifyOtpUsecaseProxy.getInstance().execute(req);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
