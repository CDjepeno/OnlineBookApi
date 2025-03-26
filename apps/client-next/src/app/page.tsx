// "use client";

import BookList from "@/components/BookList";
import { getBooks } from "@/services/book.services";

export default async function HomePage({ searchParams }: { searchParams?: { page: string } }) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = 6;
  const booksData = await getBooks(currentPage, limit); 
  return (
    <BookList initialBooks={booksData.books} totalPages={booksData.pagination.totalPages} initalPage={currentPage} />
  )
}
