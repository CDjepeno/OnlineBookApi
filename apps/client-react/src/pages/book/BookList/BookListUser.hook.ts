import { useQuery } from "@tanstack/react-query";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { getBooksByUser } from "../../../services/book.services";
import { GetBooksResponse } from "../../../types/book/book.types";

function BookListUserHook() {
  const {
    data: books,
    isPending,
    error,
  } = useQuery<GetBooksResponse[]>({
    queryKey: [BookQueriesKeysEnum.BOOKS_USER],
    queryFn: () => getBooksByUser(),
  });

  return { books, isPending, error };
}

export default BookListUserHook;
