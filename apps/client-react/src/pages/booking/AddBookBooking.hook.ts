import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BookingQueriesKeysEnum } from "../../enum/enum";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { createBooking } from "../../services/booking.service";
import { AddBookingInput } from "../../types/booking/booking.types";
import { getDisplayErrorMessage } from "../../utils/getDisplayErrorMessage";

function BookAddBookingHook(bookId: string, userId: number | null) {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: addBooking } = useMutation({
    mutationFn: async (data: AddBookingInput) => createBooking(data, userId),

    onSuccess: (data) => {
      onSuccessCommon(data.message);
      queryClient.invalidateQueries({
        queryKey: [BookingQueriesKeysEnum.BOOKINGS_BY_BOOK, bookId],
      });
    },
    onError: (error: Error | AxiosError<unknown>) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur est survenue lors de la création du livre";

      onErrorCommon(errorMessage);
    },
  });

  const handleBooking = async (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate || !endDate)
      return alert("Veuillez sélectionner une période.");

    const payload: AddBookingInput = {
      bookId,
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
    };
    await addBooking(payload);
  };

  return { handleBooking };
}

export default BookAddBookingHook;
