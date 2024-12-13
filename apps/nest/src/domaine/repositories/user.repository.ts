import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/login/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/login/login.user.response';
import { User } from '../entities/User.entity';
import { LogoutUserRequest } from 'src/application/usecases/logout/logout.user.request';

export interface UsersRepository {
  signUp(user: User): Promise<AddUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  signOut(userId: LogoutUserRequest): Promise<void>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;
}
