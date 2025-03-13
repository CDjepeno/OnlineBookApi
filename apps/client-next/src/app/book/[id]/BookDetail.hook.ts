"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { getBook } from "../../../services/book.services";
import {
  BookingBook,
  getBookingsBook,
} from "../../../services/booking.services";
import {
  BookingsQueriesKeysEnum,
  BookQueriesKeysEnum,
} from "@/types/enum/enum";
import { BookingBookFormType } from "@/types/booking/form.types";
import { ErrorResponse } from "@/types/book/response.types";

function BookDetailHook(bookId: string) {
  const queryClient = useQueryClient();

  const {
    isPending,
    data: book,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.Book],
    queryFn: () => getBook(bookId!),
    enabled: !!bookId,
  });

  const { data: bookingsBook } = useQuery({
    queryKey: [BookingsQueriesKeysEnum.GetBookingsBook],
    queryFn: () => getBookingsBook(bookId!),
    enabled: !!bookId,
  });

  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: BookingBookMutation } = useMutation({
    mutationFn: (input: BookingBookFormType) => BookingBook(input),

    onSuccess: (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookingsQueriesKeysEnum.GetBookingsBook],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const errorData = (error.response.data as ErrorResponse).message;
        onErrorCommon(errorData);
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
    },
  });

  const onSubmit = (input: BookingBookFormType) => {
    return BookingBookMutation(input);
  };

  return { isPending, bookingsBook, book, error, bookId, onSubmit };
}

export default BookDetailHook;
