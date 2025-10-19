import { GetBooksResponse, SearchFormType } from "@/types/book/book.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { getBookByName } from "../../services/book.services";

export default function BookSearchHook(books: GetBooksResponse[] = []) {
  const [lastSearch, setLastSearch] = useState("");

  const { control, handleSubmit, watch } = useForm<SearchFormType>({
    defaultValues: { search: "" },
  });

  const searchBook = watch("search");

  const filteredBooks = useMemo(() => {
    if (!searchBook) return books;
    return books.filter((b) =>
      b.title.toLowerCase().startsWith(searchBook.toLowerCase())
    );
  }, [searchBook, books]);

  const {
    data: searchedBooks = [],
    isFetching,
    refetch,
  } = useQuery<GetBooksResponse[]>({
    queryKey: [BookQueriesKeysEnum.BOOK_SEARCH, searchBook],
    queryFn: () => getBookByName(searchBook),
    enabled: false,
  });

  const handleSearchClick = async () => {
    if (searchBook.trim()) {
      setLastSearch(searchBook);
      await refetch();
    } else {
      setLastSearch("");
    }
  };

  
  const booksToDisplay = lastSearch && searchBook.trim() === lastSearch ? searchedBooks : filteredBooks;

  return {
    control,
    handleSubmit,
    handleSearchClick,
    booksToDisplay,
    isFetching,
  };
}
