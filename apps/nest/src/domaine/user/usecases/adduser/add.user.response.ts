import { Sexe } from "src/domaine/enums/sexe.enum";

export type AddUserResponse = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  sexe: Sexe
}

export type AddUserResponseType = {
  message: string;
};

