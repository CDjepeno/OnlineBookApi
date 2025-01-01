import { BookRepository } from "src/repositories/book.repository";

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<string> {
    await this.repository.deleteBook(id);
    return `Le livre avec l'id ${id} a bien été supprimé.`;
  }
}
