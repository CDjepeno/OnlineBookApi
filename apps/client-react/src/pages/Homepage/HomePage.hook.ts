import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { getBooks } from "../../services/book.services";
import { GetBookByNameInput } from "../../types/book/input.types";

export default function HomePageHook(page: number, limit: number) {
  const {
    isPending,
    data: booksPagination,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.GetBooks, page, limit],
    queryFn: () => getBooks(page, limit),
  });

  const {
    control,
    formState: { errors },
  } = useForm<GetBookByNameInput>();

  const totalPages = booksPagination?.pagination.totalPages;
  const books = booksPagination?.books;

  return { isPending, books, error, control, errors, totalPages };
}
