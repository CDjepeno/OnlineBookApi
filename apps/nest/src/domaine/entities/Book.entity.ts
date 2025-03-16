export class BookEntity {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly description: string,
    readonly author: string,
    readonly releaseAt: Date,
    readonly coverUrl: string,
    readonly userId: number,
  ) {}
}
