import { useQuery } from "@tanstack/react-query";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { getBooks } from "../../services/book.services";

export default function HomePageHook() {
  const {
    isPending,
    data: books,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.GET_BOOKS],
    queryFn: getBooks,
  });

  return { isPending, books, error };
}
