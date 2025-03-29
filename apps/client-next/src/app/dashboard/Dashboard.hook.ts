import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { ErrorResponse } from "@/types/book/response.types";
import { UpdateBookingUserFormType } from "@/types/booking/form.types";
import {
  DeleteBookingsUserResponse,
  DeleteBookingUserResponse,
  UpdateBookingUserResponse,
} from "@/types/booking/response.types";
import { BookingsQueriesKeysEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DeleteBookingsUser,
  DeleteBookingUser,
  UpdateBookingUser,
} from "../../services/booking.services";

function DashboardHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

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

    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const errorData = (error.response.data as ErrorResponse).message;
        onErrorCommon(errorData);
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
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

    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const errorData = (error.response.data as ErrorResponse).message;
        onErrorCommon(errorData);
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
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

    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const errorData = (error.response.data as ErrorResponse).message;
        onErrorCommon(errorData);
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
    },
  });

  return {
    updateBookingMutation,
    deleteBookingMutation,
    deleteBookingsMutation,
  };
}

export default DashboardHook;
