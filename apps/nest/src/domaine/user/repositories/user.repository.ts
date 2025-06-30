import { User } from '../entities/User.entity';
import { AddUserResponse } from '../usecases/adduser/add.user.response';
import { CurrentUserResponse } from '../usecases/auth/current.user.response';
import { LoginUserRequest } from '../usecases/getuser/login.user.request';
import { LoginUserResponse } from '../usecases/getuser/login.user.response';

export interface UsersRepository {
  signUp(user: User): Promise<AddUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;
}
