import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { User } from 'src/infras/models/user.model';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { RegisterDto } from './register.dto';

@ApiTags('User')
@Controller('register')
export class RegisterController {
  constructor(
    @Inject(UsecaseProxyEnum.CREATE_USER_USECASE_PROXY)
    private readonly createUserUsecaseProxy: UseCaseProxy<AddUserUseCase>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a User',
  })
  @ApiCreatedResponse({ description: 'User created.', type: User })
  async createUser(@Body() createUserDto: RegisterDto) {
    try {
      return await this.createUserUsecaseProxy
        .getInstance()
        .execute(createUserDto);
    } catch (error) {
      console.error('Error occurred while updating user:', error);
      
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed create user');
    }
  }

}
