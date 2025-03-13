import { HttpException } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/user.repository';
import { CurrentUserResponse } from './current.user.response';

export class GetCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string): Promise<CurrentUserResponse> {
    try {
      const user = await this.usersRepository.getCurrentUser(email);
      const responses = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        sexe: user.sexe,
      };
      return responses;
    } catch (error) {
      if (error instanceof HttpException) {
        // Si c'est une exception NestJS connue, on la relance directement
        throw error;
      }
      throw error;
    }
  }
}
