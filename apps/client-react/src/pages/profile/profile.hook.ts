import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { getUserById } from "src/services/user.services";
import { BookQueriesKeysEnum, UserQueriesKeysEnum } from "../../enum/enum";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { deleteBook, getBooksByUser } from "../../services/book.services";
import { ErrorResponse } from "src/types/book/response.types";

function ProfileHook() {
  const { id: userId } = useParams<{ id: string }>();

  const {
    data: books,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.BooksUser],
    queryFn: () => getBooksByUser(userId!),
    enabled: !!userId,
  });

  const {
    data: user,
    isPending: isPendingUser,
    error: errorUser,
  } = useQuery({
    queryKey: [UserQueriesKeysEnum.GetUserByID],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: deleteBookMutation } = useMutation<
    void,
    AxiosError<unknown>,
    number
  >({
    mutationFn: async (id: number) => deleteBook(id),

    onSuccess: async () => {
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

  return {
    books,
    isPending,
    error,
    deleteBookMutation,
    user,
    isPendingUser,
    errorUser,
  };
}

export default ProfileHook;
