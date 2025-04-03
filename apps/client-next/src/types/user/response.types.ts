export type SigninResponse = {
  msg: string;
};

export type VerifyOtpResponse = {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
};

export type CurrentUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: string;
};

export interface UpdateUserResponse {
  msg: string;
}

export type GetUserByIdResponse = {
  id: number;
  name: string;
  password?: string;
  confirmPassword?: string;
  email: string;
  phone: string;
  sexe: string;
};
export type UserFromData = {
  id?: number
  email: string;
  password?: string;
  confirmPassword?: string;
  name: string;
  phone: string;
  sexe: string;
};
export type RegisterResponse = {
  msg: string;
};

export type OAuthGoogleResponse = {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
  msg: string;
  userId: number;
};

export type DeleteUserResponse = {
  msg: string;
};

