import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  BookingsQueriesKeysEnum,
  BookQueriesKeysEnum,
} from "../../../enum/enum";
import { getBook } from "../../../services/book.services";
import { BookingBook, getBookingsBook } from "../../../services/booking.services";
import { ErrorResponse } from "../../../types/book/book.types";
import { AxiosError } from "axios";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { BookingBookFormInput } from "../../../types/user/form.types";

function BookDetailHook() {
  const { id: bookId } = useParams<{ id: string }>();
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
    mutationFn: (input: BookingBookFormInput) => BookingBook(input),

    onSuccess: () => {
      onSuccessCommon("Le livre a été réserver avec succès");
      queryClient.invalidateQueries({
        queryKey: [BookingsQueriesKeysEnum.GetBookingsBook],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la reservation du livre";

      if ((error as AxiosError<unknown>).isAxiosError) {
        if (
          (error as AxiosError).response &&
          (error as AxiosError).response!.data &&
          ((error as AxiosError).response!.data as ErrorResponse)
        ) {
          errorMessage = ((error as AxiosError).response!.data as ErrorResponse)
            .message;
        }
      }
      onErrorCommon(errorMessage);
    },
  });

  const onSubmit = (input: BookingBookFormInput) => {
    return BookingBookMutation(input);
  };

  return { isPending, bookingsBook, book, error, bookId, onSubmit };
}

export default BookDetailHook;
