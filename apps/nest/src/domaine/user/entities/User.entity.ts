import { Sexe } from "src/domaine/enums/sexe.enum";

export class User {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly phone: string,
    readonly sexe: Sexe
  ) {}
}
