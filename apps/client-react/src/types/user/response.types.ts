export type SigninResponse = {
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
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  sexe: string;
}

export type GetUserByIdResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: string;
};

