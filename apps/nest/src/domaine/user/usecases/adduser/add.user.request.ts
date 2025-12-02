import { Sexe } from "src/domaine/enums/sexe.enum";

export class AddUserRequest {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  sexe: Sexe;
}
