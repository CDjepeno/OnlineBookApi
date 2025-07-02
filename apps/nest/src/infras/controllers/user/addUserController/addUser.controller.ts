import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { User } from 'src/infras/models/user.model';
import { UseCaseProxy } from '../../../usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from '../../../usecase-proxy/usecase-proxy.module';
import { AddUserDto } from './addUser.dto';

@ApiTags('User')
@Controller('register')
export class AddUserController {
  constructor(
    @Inject(UsecaseProxyModule.CREATE_USER_USECASE_PROXY)
    private readonly createUserUsecaseProxy: UseCaseProxy<AddUserUseCase>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
  })
  @ApiCreatedResponse({ description: 'User created.', type: User })
  async createUser(@Body() addUserDto: AddUserDto) {
    const result = await this.createUserUsecaseProxy
      .getInstance()
      .execute(addUserDto);

    return {
      data: result,
    };
  }
}
