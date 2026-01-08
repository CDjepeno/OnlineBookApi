import { BadRequestException } from '@nestjs/common';

export class Phone {
  private static readonly PHONE_REGEX = /^((\+33)|0033|0)[6-7](\d{2}){4}$/;
  private readonly value: string;

  constructor(phone: string) {
    if (!Phone.PHONE_REGEX.test(phone)) {
      throw new BadRequestException("Numero n'est pas valide");
    }
    this.value = phone;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
