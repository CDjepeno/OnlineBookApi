export type LoginFormInput = {
  email: string;
  password: string;
}

export type UserFormInput = {
  id?: number
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};

export type UpdateUserInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};