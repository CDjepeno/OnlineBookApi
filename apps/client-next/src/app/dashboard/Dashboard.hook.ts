import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import {
  DeleteBookingsUser,
  DeleteBookingUser,
  GetBookingsUser,
  UpdateBookingUser,
} from "../../services/booking.services";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { BookingsQueriesKeysEnum } from "@/types/enum/enum";
import { DeleteBookingsUserResponse, DeleteBookingUserResponse, UpdateBookingUserResponse } from "@/types/booking/response.types";
import { UpdateBookingUserFormType } from "@/types/booking/form.types";
import { ErrorResponse } from "@/types/book/response.types";

function DashboardHook(page: number, limit: number) {
  const { user } = useContext(AuthContext) as AuthContextValue;
  const userId = user?.id.toString();
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    data: bookingsU,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookingsQueriesKeysEnum.GetBookingsUser, page],
    queryFn: () => GetBookingsUser(userId!, page, limit),
    enabled: !!user?.id,
  });
  const bookingsUser = bookingsU?.bookings;
  const totalPages = bookingsU?.pagination.totalPages;

  const { mutateAsync: updateBookingMutation } = useMutation<
    UpdateBookingUserResponse,
    AxiosError,
    UpdateBookingUserFormType
  >({
    mutationFn: (data: UpdateBookingUserFormType) => UpdateBookingUser(data),

    onSuccess: async (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookingsQueriesKeysEnum.GetBookingsUser],
      });
    },

    onError: (error: Error | AxiosError) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression des livre";

      if ((error as AxiosError).isAxiosError) {
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

  const { mutateAsync: deleteBookingMutation } = useMutation<
    DeleteBookingUserResponse,
    AxiosError<unknown>,
    number
  >({
    mutationFn: async (id: number) => DeleteBookingUser(id),

    onSuccess: async (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookingsQueriesKeysEnum.GetBookingsUser],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression de la reservation";

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

  const { mutateAsync: deleteBookingsMutation } = useMutation<
    DeleteBookingsUserResponse,
    AxiosError<unknown>,
    number[]
  >({
    mutationFn: async (id: number[]) => DeleteBookingsUser(id),

    onSuccess: async (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookingsQueriesKeysEnum.GetBookingsUser],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression de la reservation";

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

  return {
    bookingsUser,
    isPending,
    error,
    totalPages,
    updateBookingMutation,
    deleteBookingMutation,
    deleteBookingsMutation
  };
}

export default DashboardHook;
