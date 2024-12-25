import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/auth/login/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/auth/login/login.user.response';
import { LogoutUserRequest } from 'src/application/usecases/user/auth/logout/logout.user.request';
import { RefreshTokenRequest } from 'src/application/usecases/user/auth/refreshToken/refresh.token.request';
import { RefreshTokenResponse } from 'src/application/usecases/user/auth/refreshToken/refresh.token.response';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';

export interface UsersRepository {
  signUp(user: AddUserRequest): Promise<AddUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  signOut(userId: LogoutUserRequest): Promise<void>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;
  getRefreshToken(refreshToken: RefreshTokenRequest): Promise<RefreshTokenResponse>;
}
