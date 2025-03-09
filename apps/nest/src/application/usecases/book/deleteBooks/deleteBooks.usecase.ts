import { BookRepository } from "src/repositories/book.repository";

export class DeleteBooksUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(ids: Array<string>): Promise<{msg:string}> {
    await this.repository.deleteBooks(ids);
    return {msg: "Les livres ont bien été supprimer"}
  }
}
