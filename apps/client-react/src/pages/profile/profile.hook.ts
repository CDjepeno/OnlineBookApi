import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { getUserById } from "src/services/user.services";
import { DeleteBooksResponse, ErrorResponse } from "src/types/book/response.types";
import { BookQueriesKeysEnum, UserQueriesKeysEnum } from "../../enum/enum";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { deleteBook, deleteBooks, getBooksByUser } from "../../services/book.services";

function ProfileHook(page: number, limit: number) {
  const { id: userId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    data: booksPagination,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookQueriesKeysEnum.BooksUser, page],
    queryFn: () => getBooksByUser(userId!, page, limit),
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


  const { mutateAsync: deleteBookMutation } = useMutation<
  DeleteBooksResponse,
    AxiosError<unknown>,
    number
  >({
    mutationFn: async (id: number) => deleteBook(id),

    onSuccess: async (res) => {
      onSuccessCommon(res.message);
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
      onSuccessCommon(res.message);
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



  const books = booksPagination?.books;
  const totalPage = booksPagination?.pagination.totalPages;

  return {
    books,
    isPending,
    error,
    deleteBookMutation,
    deleteBooksMutation,
    user,
    isPendingUser,
    errorUser,
    totalPage
  };
}

export default ProfileHook;
