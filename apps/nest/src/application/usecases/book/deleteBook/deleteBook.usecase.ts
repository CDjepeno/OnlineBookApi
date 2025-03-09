import { BookRepository } from "src/repositories/book.repository";

export class DeleteBookUsecase {
  constructor(private readonly repository: BookRepository) {}

  async execute(id: number): Promise<{msg:string}> {
    await this.repository.deleteBook(id);
    return {msg:`Le livre a bien été supprimé.`};
  }
}
