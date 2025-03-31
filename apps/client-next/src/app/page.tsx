
import BookList from "@/app/BookList";
import { getBooks } from "@/services/book.services";

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ page: string }> }) {
  const currentPage = (await searchParams)?.page ? parseInt((await searchParams!).page) : 1;
  const limit = 6;
  const booksData = await getBooks(currentPage, limit); 
  return (
    <BookList initialBooks={booksData.books} totalPages={booksData.pagination.totalPages} initalPage={currentPage} />
  )
}
