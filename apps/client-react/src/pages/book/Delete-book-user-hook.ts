import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { deleteBook } from "../../services/book.services";

interface ErrorResponse {
  message: string;
}

function DeleteBookUserHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: deleteBookMutation } = useMutation<
    void,
    AxiosError<unknown>,
    string
  >({
    mutationFn: async (id: string) => deleteBook(id),

    onSuccess: () => {
      onSuccessCommon("Le livre a été supprimé avec succès");
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

  return { deleteBookMutation };
}

export default DeleteBookUserHook;
