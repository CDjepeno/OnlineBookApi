import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/getuser/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/getuser/login.user.response';
import { User } from '../domaine/entities/User.entity';

export interface UsersRepository {
  signUp(user: User): Promise<AddUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;
}
