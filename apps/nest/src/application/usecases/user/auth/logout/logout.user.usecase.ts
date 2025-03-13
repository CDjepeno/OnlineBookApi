import { HttpException } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/user.repository';
import { LogoutUserRequest } from './logout.user.request';

export class LogoutUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: LogoutUserRequest): Promise<void> {
    try {
      return await this.usersRepository.signOut(request);
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
