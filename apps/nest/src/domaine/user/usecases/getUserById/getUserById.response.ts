import { Sexe } from 'src/domaine/enums/sexe.enum';

export type GetUserByIdResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sexe: Sexe;
};
