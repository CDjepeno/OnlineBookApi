import { getBook } from "@/services/book.services";
import { getBookingsBook } from "@/services/booking.services";
import BookDetail from "./BookDetail";

async function Book({ params }: { params: { id: string } }) {
  const { id } = params;

  const book = await getBook(id);
  const bookingsBook = await getBookingsBook(id);
  return <BookDetail book={book} bookingsBook={bookingsBook} />;
}

export default Book;
