import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { getBooksByUser } from "../../../services/book.services";

function BookListUserHook() {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: books,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.BooksUser],
    queryFn: () => getBooksByUser(userId!),
    enabled: !!userId,
  });

  return { books, isPending, error };
}

export default BookListUserHook;
