export class ContactEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly email: string,
    readonly message: string,
  ) {}
}
