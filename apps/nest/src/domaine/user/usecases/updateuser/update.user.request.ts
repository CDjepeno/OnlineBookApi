import { Sexe } from '../../../enums/sexe.enum';

export class UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  sexe?: Sexe;
}
