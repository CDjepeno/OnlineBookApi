import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { deleteBook, deleteBooks } from "@/services/book.services";
import {
  DeleteBooksResponse,
  ErrorResponse,
} from "@/types/book/response.types";
import { BookQueriesKeysEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

function ProfileHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: deleteBookMutation } = useMutation<
    DeleteBooksResponse,
    AxiosError<unknown>,
    number
  >({
    mutationFn: async (id: number) => deleteBook(id),

    onSuccess: async (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BooksUser],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression du livre";

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

  const { mutateAsync: deleteBooksMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteBooks(ids),

    onSuccess: async (res) => {
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BooksUser],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression des livre";

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
    deleteBookMutation,
    deleteBooksMutation,
  };
}

export default ProfileHook;
