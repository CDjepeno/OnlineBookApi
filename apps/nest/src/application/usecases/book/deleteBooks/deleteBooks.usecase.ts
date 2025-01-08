import { BookRepository } from "src/repositories/book.repository";

export class DeleteBooksUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(ids: Array<string>): Promise<string> {
    await this.repository.deleteBooks(ids);
    return "Les livres ont bien été supprimer"
  }
}
