"use client";

import { getBooks } from "@/services/book.services";
import { GetBookByNameInput } from "@/types/book/input.types";
import { BookQueriesKeysEnum } from "@/types/enum/enum";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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
