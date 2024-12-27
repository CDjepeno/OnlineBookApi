import { AddUserResponse } from 'src/application/usecases/user/adduser/add.user.response';
import { CurrentUserByIdResponse, CurrentUserResponse } from 'src/application/usecases/user/auth/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/auth/login/login.user.request';
import { LoginUserResponse } from 'src/application/usecases/user/auth/login/login.user.response';
import { LogoutUserRequest } from 'src/application/usecases/user/auth/logout/logout.user.request';
import { RefreshTokenRequest } from 'src/application/usecases/user/auth/refreshToken/refresh.token.request';
import { RefreshTokenResponse } from 'src/application/usecases/user/auth/refreshToken/refresh.token.response';
import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { UpdateUserRequest } from 'src/application/usecases/user/updateUser/update.user.request';
import { UpdateUserResponse } from 'src/application/usecases/user/updateUser/update.user.response';

export interface UsersRepository {
  signUp(user: AddUserRequest): Promise<AddUserResponse>;
  updateUser(user: Partial<UpdateUserRequest>, existingUser: CurrentUserByIdResponse): Promise<UpdateUserResponse>;
  signIn(user: LoginUserRequest): Promise<LoginUserResponse>;
  signOut(userId: LogoutUserRequest): Promise<void>;
  getCurrentUser(email: string): Promise<CurrentUserResponse>;
  getCurrentUserById(id: number): Promise<CurrentUserResponse>;
  getRefreshToken(refreshToken: RefreshTokenRequest): Promise<RefreshTokenResponse>;
}
