import { Sexe } from "@/enum/sexe.enum";

export type RegisterFormInput = {
  name: string;
  phone: string;
  email: string;
  sexe: Sexe | "";
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  data: { message: string };
};
