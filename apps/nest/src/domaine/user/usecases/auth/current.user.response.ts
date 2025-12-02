import { Sexe } from "src/domaine/enums/sexe.enum";

export type CurrentUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe?: Sexe;
};
