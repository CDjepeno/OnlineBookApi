import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { getBook } from "../../../services/book.services";
import { GetBookResponse } from "../../../types/book/book.types";

function BookDetailHook() {
  const { id } = useParams<{ id: string }>();

  const queryKey = useMemo(() => [BookQueriesKeysEnum.Book, id] as const, [id]);

  const {
    isPending,
    data: book,
    error,
  } = useQuery<GetBookResponse>({
    queryKey,
    queryFn: async () => {
      if (!id) throw new Error("L'ID du livre est requis");

      return await getBook(id);
    },
    enabled: Boolean(id),
  });

  return { isPending, book, error };
}

export default BookDetailHook;
