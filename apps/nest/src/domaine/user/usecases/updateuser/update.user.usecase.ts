import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../repositories/user.repository';
import { UpdateUserRequest } from './update.user.request';
import { UpdateUserResponse } from './update.user.response';
import { User } from '../../entities/User.entity';
import { Phone } from '../../value-objects/phone.value-object';

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    if (
      !request.name &&
      !request.email &&
      !request.password &&
      !request.phone &&
      !request.sexe
    ) {
      throw new BadRequestException(
        'Au moins un champ doit être fourni pour la mise à jour',
      );
    }

    const existingUser = await this.usersRepository.getUserById(request.id);
    if (!existingUser) {
      throw new NotFoundException("L'utilisateur n'existe pas");
    }

    const phoneValue = request.phone
      ? new Phone(request.phone).getValue()
      : existingUser.phone;

    const updatedUser = new User(
      request.id,
      request.name ?? existingUser.name,
      request.email ?? existingUser.email,
      request.password ?? existingUser.password,
      phoneValue,
      request.sexe ?? existingUser.sexe,
    );

    await this.usersRepository.updateUser(updatedUser);

    return { message: 'Votre profil a bien été mis à jour' };
  }
}
