import { UserModel } from '../../domaine/model/user.model';
import { CreateUserDto } from '../../domaine/model/user.dtos';
import { UsersRepository } from '../../domaine/repositories/user.repository';
import { ClientSmsPort } from '../../domaine/repositories/client.sms.port';
import { BadRequestException } from '@nestjs/common';

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private clientSms: ClientSmsPort,
  ) {}

  async execute(request: CreateUserDto): Promise<UserModel> {
    const regexPhone = /^(\+336|\+337)\d{8}$/;
    try {
      if (!regexPhone.test(request.phone)) {
        throw new BadRequestException("Numero n'est pas valide");
      }
      this.clientSms.sendMessage(request.phone);
      return this.usersRepository.createUser(request);
    } catch (err) {
      throw new Error(err);
    }
  }
}
