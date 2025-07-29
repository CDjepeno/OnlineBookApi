import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { getBooksByUser } from "../../../services/book.services";
import { GetBooksByUserResponse } from "../../../types/book/book.types";

function BookListUserHook() {
  const { userId } = useParams<{ userId: string }>();

  const queryKey = useMemo(
    () => [BookQueriesKeysEnum.BOOKS_USER, userId] as const,
    [userId]
  );

  const {
    data: books,
    isPending,
    error,
  } = useQuery<GetBooksByUserResponse[]>({
    queryKey,
    queryFn: () => {
      if (!userId) throw new Error(" ID utilisateur requis.");
      return getBooksByUser(userId);
    },
    enabled: Boolean(userId),
  });

  return { books, isPending, error };
}

export default BookListUserHook;
