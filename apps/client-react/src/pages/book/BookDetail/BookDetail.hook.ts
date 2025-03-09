import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { getBook } from "../../../services/book.services";

function BookDetailHook() {
  const { id } = useParams<{ id: string }>();

  const {
    isPending,
    data: book,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.Book],
    queryFn: () => getBook(id!),
    enabled: !!id,
  });

  return { isPending, book, error };
}

export default BookDetailHook;
