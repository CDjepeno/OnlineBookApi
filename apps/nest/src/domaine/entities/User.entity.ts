

export class User {
  constructor( 
    readonly id: number,
    readonly name: string,
    readonly password: string,
    readonly email: string,
    readonly phone: string,
    readonly sexe: string,
  ) {}
}
