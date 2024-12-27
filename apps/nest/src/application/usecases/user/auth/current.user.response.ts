
export type CurrentUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: string;
};

export type CurrentUserByIdResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: string;
  password?:string
};
