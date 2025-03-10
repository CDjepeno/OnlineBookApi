import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserUseCase } from 'src/application/usecases/user/updateUser/update.user.usecase';
import { UseCaseProxy } from 'src/infras/usecase-proxy/usecase-proxy';
import { UsecaseProxyEnum } from 'src/infras/usecase-proxy/usecase-proxy-config';
import { UpdateUserDto } from './updateUser.dto';

@ApiTags('User')
@Controller('user')
export class UpdateUserController {
  constructor(
    @Inject(UsecaseProxyEnum.UPDATE_USER_USECASE_PROXY)
    private readonly updateUsecaseProxy: UseCaseProxy<UpdateUserUseCase>,
  ) {}

  @Put(':id')
  @ApiOperation({
    summary: 'Update User',
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) idUser: number,
  ) {
    try {
      const dataToUpdate = {...updateUserDto, id: idUser}

      return await this.updateUsecaseProxy
        .getInstance()
        .execute(dataToUpdate);
      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
