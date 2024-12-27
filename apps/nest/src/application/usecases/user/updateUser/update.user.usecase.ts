import { User } from 'src/domaine/entities/User.entity';
import { InvalidPhoneNumberException, NotFoundError } from 'src/domaine/errors/book.error';
import { UsersRepository } from '../../../../domaine/repositories/user.repository';
import { UpdateUserRequest } from './update.user.request';
import { UpdateUserResponse } from './update.user.response';

export class UpdateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
  ) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const regexPhone = /^((\+)33)|(0)[6-7](\d{2}){4}$/;
    if (!regexPhone.test(request.phone)) {
      throw new InvalidPhoneNumberException("Numero n'est pas valide");
    }

     const existingUser = await this.userRepository.getCurrentUserById(+request.id);
    
          if (!existingUser) {
            throw new NotFoundError(`L'user avec l'ID ${request.id} est introuvable.`);
          }
    
    const user = new User(
      request.id,
      request.name,
      request.password,
      request.email,
      request.phone,
      request.sexe,
    );

    return await this.userRepository.updateUser(user, existingUser);
  }
}
