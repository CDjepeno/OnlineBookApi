"use client";

import { ErrorResponse } from "@/types/book/response.types";
import { BookingBookFormType } from "@/types/booking/form.types";
import { BookingsQueriesKeysEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { BookingBook } from "../../../services/booking.services";

function BookDetailHook() {
  const queryClient = useQueryClient();

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

  return { onSubmit };
}

export default BookDetailHook;
