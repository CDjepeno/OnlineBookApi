import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { BookQueriesKeysEnum } from "../../../enum/enum";
import { ErrorMessageEnum } from "../../../enum/message.enum";
import { getBooksByUser } from "../../../services/book.services";
import { GetBooksResponse } from "../../../types/book/book.types";

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
  } = useQuery<GetBooksResponse[]>({
    queryKey,
    queryFn: () => {
      if (!userId) throw new Error(ErrorMessageEnum.USER_ID_REQUIRED);

      return getBooksByUser(userId);
    },
    enabled: !!userId,
  });

  return { books, isPending, error };
}

export default BookListUserHook;
