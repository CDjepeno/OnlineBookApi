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
