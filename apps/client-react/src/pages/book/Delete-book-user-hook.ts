import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { deleteBook } from "../../services/book.services";
import { getDisplayErrorMessage } from "../../utils/getDisplayErrorMessage";

function DeleteBookUserHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: deleteBookMutation } = useMutation<
    void,
    AxiosError<unknown>,
    string
  >({
    mutationFn: deleteBook,

    onSuccess: () => {
      onSuccessCommon("Le livre a été supprimé avec succès");
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BOOKS_USER],
      });
    },

    onError: (error) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur est survenue lors de la suppression du livre";

      onErrorCommon(errorMessage);
    },
  });

  return { deleteBookMutation };
}

export default DeleteBookUserHook;
