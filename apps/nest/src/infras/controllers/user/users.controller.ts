import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { User } from 'src/infras/models/user.model';
import { UseCaseProxy } from '../../../infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from '../../../infras/usecase-proxy/usecase-proxy.module';
import { CreateUserDto } from './user.dto';

@ApiTags('register')
@Controller('register')
export class UsersController {
  constructor(
    @Inject(UsecaseProxyModule.CREATE_USER_USECASE_PROXY)
    private readonly createUserUsecaseProxy: UseCaseProxy<AddUserUseCase>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a Post',
  })
  @ApiCreatedResponse({ description: 'User created.', type: User })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.createUserUsecaseProxy
        .getInstance()
        .execute(createUserDto);
      return {
        data: result,
      };
    } catch (err) {
      throw err;
    }
  }
}
