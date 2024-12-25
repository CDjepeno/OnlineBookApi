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
