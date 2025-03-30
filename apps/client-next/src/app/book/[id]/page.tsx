import { getBook } from "@/services/book.services";
import { getBookingsBook } from "@/services/booking.services";
import BookDetail from "./BookDetail";

// Typage des Props
type PageProps = {
  params: { id: string };
};

export default async function Book({ params }: PageProps) {
  try {
    if (!params || typeof params.id !== "string") {
      throw new Error("Invalid params");
    }

    const book = await getBook(params.id);
    const bookingsBook = await getBookingsBook(params.id);

    return <BookDetail book={book} bookingsBook={bookingsBook} />;
  } catch (error) {
    console.error(error);
    return <div>Une erreur est survenue.</div>;
  }
}