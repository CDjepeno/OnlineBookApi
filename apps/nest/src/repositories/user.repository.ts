import { AddUserRequest } from 'src/application/usecases/user/adduser/add.user.request';
import { CurrentUserResponse } from 'src/application/usecases/user/auth/GetCurrentUser/current.user.response';
import { LoginUserRequest } from 'src/application/usecases/user/auth/login/login.user.request';
import { LogoutUserRequest } from 'src/application/usecases/user/auth/logout/logout.user.request';
import { OAuthGoogleResponse } from 'src/application/usecases/user/auth/OAuthGoogle/OAuthGoogle.response';
import { RefreshTokenRequest } from 'src/application/usecases/user/auth/refreshToken/refresh.token.request';
import { RefreshTokenResponse } from 'src/application/usecases/user/auth/refreshToken/refresh.token.response';
import { VerifyOtpResponse } from 'src/application/usecases/user/auth/verifyOtp/verifyOtp.response';
import { CurrentUserByIdResponse } from 'src/application/usecases/user/GetUserById/current.user.response';
import { UpdateUserRequest } from 'src/application/usecases/user/updateUser/update.user.request';
import { credentialGoogleResponse } from 'src/infras/controllers/user/OAuth-google/oauth.google.controller';

export interface UsersRepository {
  signUp(user: AddUserRequest): Promise<void>;
  updateUser(
    user: Partial<UpdateUserRequest>,
    existingUser: CurrentUserByIdResponse,
  ): Promise<void>;
  signIn(user: LoginUserRequest): Promise<{ email: string }>;
  createJwt(email: string): Promise<VerifyOtpResponse>;
  signOut(userId: LogoutUserRequest): Promise<void>;
  getCurrentUser(token: string): Promise<CurrentUserResponse>;
  getUserById(id: number): Promise<CurrentUserResponse>;
  deleteUser(id: number): Promise<void>;
  getRefreshToken(
    refreshToken: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse>;
  validateOrCreateGoogleUser(
    user: credentialGoogleResponse,
  ): Promise<OAuthGoogleResponse>;
}
