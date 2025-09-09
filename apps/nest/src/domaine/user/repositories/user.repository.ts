import { User } from '../entities/User.entity';
import { AddUserResponse } from '../usecases/adduser/add.user.response';
import { CurrentUserResponse } from '../usecases/auth/current.user.response';
import { LoginUserRequest } from '../usecases/getuser/login.user.request';
import { LoginUserResponse } from '../usecases/getuser/login.user.response';
import { LoginGoogleRequest } from '../usecases/google/login.google.request';
import { LoginGoogleResponse } from '../usecases/google/login.google.response';

export interface UsersRepository {
  signUp(user: User): Promise<AddUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;

  findGoogleUserAndGenerateToken(email: string): Promise<LoginGoogleResponse | null>;
  signUpByGoogleAuth(user: LoginGoogleRequest): Promise<LoginGoogleResponse>;
}
