import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { ErrorMessageEnum, SuccessMessageEnum } from "../../enum/message.enum";
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
      onSuccessCommon(SuccessMessageEnum.BOOK_DELETE_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BOOKS_USER],
      });
    },

    onError: (error) => {
      const errorMessage =
        getDisplayErrorMessage(error) || ErrorMessageEnum.BOOK_DELETE_ERROR;

      onErrorCommon(errorMessage);
    },
  });

  return { deleteBookMutation };
}

export default DeleteBookUserHook;
