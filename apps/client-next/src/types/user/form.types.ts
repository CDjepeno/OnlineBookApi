


export type AddUserForm = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};

export type UpdateUserForm = {
  id?: string
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};