import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { ErrorResponse } from "src/types/book/response.types";
import { BookingBookFormType } from "src/types/booking/form.types";
import {
  BookingsQueriesKeysEnum,
  BookQueriesKeysEnum,
} from "../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { getBook } from "../../../services/book.services";
import {
  BookingBook,
  getBookingsBook,
} from "../../../services/booking.services";

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
    mutationFn: (input: BookingBookFormType) => BookingBook(input),

    onSuccess: (res) => {
      onSuccessCommon(res.msg);
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

  const onSubmit = (input: BookingBookFormType) => {
    return BookingBookMutation(input);
  };

  return { isPending, bookingsBook, book, error, bookId, onSubmit };
}

export default BookDetailHook;
