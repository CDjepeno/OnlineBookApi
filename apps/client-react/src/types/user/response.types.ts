export type SigninResponse = {
  name: string;
  email: string;
  token: string;
};

export type CurrentUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: "homme" | "femme";
};

export type UpdateUserDto = {
  name: string;
  email: string;
  phone: string;
  sexe: "homme" | "femme";
};

export type UpdateUserResponse = {
  data: {
    message: string;
  };
};

export type DeletProfileResponse = {
  data: {
    message: string;
  };
};
