import { getBook } from "@/services/book.services";
import { getBookingsBook } from "@/services/booking.services";
import BookDetail from "./BookDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Book({ params }: PageProps) {
  try {
    const {id} = await params;

    const book = await getBook(id);
    const bookingsBook = await getBookingsBook(id);

    return <BookDetail book={book} bookingsBook={bookingsBook} />;
  } catch (error) {
    console.error(error);
    return <div>Une erreur est survenue.</div>;
  }
}
