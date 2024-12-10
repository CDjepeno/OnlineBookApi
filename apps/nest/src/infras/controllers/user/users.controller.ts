import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { User } from 'src/infras/models/user.model';
import { UseCaseProxy } from '../../../infras/usecase-proxy/usecase-proxy';
import { CreateUserDto } from './user.dto';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';

@ApiTags('Authentication')
@Controller('register')
export class UsersController {
  constructor(
    @Inject(UsecaseProxyEnum.CREATE_USER_USECASE_PROXY)
    private readonly createUserUsecaseProxy: UseCaseProxy<AddUserUseCase>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a User',
  })
  @ApiCreatedResponse({ description: 'User created.', type: User })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.createUserUsecaseProxy
        .getInstance()
        .execute(createUserDto);

      const { name, email, phone } = result;
      return {
        name,
        email,
        phone,
      };
    } catch (err) {
      throw err;
    }
  }
}
