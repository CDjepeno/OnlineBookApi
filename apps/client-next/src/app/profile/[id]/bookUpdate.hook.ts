import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { updateBook } from "@/services/book.services";
import { BookFormData } from "@/types/book/form.types";
import { UpdateBookResponse } from "@/types/book/response.types";
import { BookQueriesKeysEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

function BookUpdateHook(setIsFormOpen?: (value: boolean) => void) {
  // ////////////////////////Update Book

  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: updateBookMutation } = useMutation<
    UpdateBookResponse,
    AxiosError<unknown>,
    { bookId: number; data: FormData | Record<string, unknown> }
  >({
    mutationFn: async ({ bookId: id, data }) => updateBook(id, data),

    onSuccess: (res) => {
      if (setIsFormOpen) {
        setIsFormOpen(false);
      }
      onSuccessCommon(res.msg);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BooksUser],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la mise à jour du livre";

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

  const onSubmit = async (data: BookFormData) => {
    try {
      const { id, title, description, author, releaseAt, coverUrl } = data;
      if (coverUrl instanceof File) {
        const data = new FormData();

        data.append("coverUrl", coverUrl);
        data.append("title", title);
        data.append("description", description);
        data.append("author", author);
        data.append("releaseAt", releaseAt ? releaseAt.toString() : "");

        await updateBookMutation({ bookId: id!, data });
      } else {
        await updateBookMutation({
          bookId: id!,
          data: data as unknown as Record<string, unknown>,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    onSubmit,
  };
}

export default BookUpdateHook;
