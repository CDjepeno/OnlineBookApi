export class BookingEntity {
  constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly startAt: Date,
    readonly endAt: Date,
    readonly userId: number,
    readonly bookId: number,
  ) {}
}