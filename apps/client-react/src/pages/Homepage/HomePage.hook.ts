import { GetAllBooksPaginationResponse } from "@/types/book/book.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { getBooks } from "../../services/book.service";

export default function HomePageHook(initialPage = 1, initialLimit = 6) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const queryKey = useMemo(
    () => [BookQueriesKeysEnum.GET_BOOKS, page, limit] as const,
    [page, limit]
  );
  const {
    isPending,
    data: books,
    error,
    refetch,
  } = useQuery<GetAllBooksPaginationResponse>({
    queryKey,
    queryFn: () => getBooks(page, limit),
    placeholderData: (prev) => prev,
  });

  const nextPage = () =>
    setPage((p) => Math.min(p + 1, books?.totalPages ?? p + 1));

  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return {
    isPending,
    books,
    error,
    page,
    limit,
    nextPage,
    prevPage,
    setPage,
    setLimit,
    refetch,
  };
}
