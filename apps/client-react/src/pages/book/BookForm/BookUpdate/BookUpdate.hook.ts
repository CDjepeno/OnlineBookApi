import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../../../enum/enum";
import {
  ErrorMessageEnum,
  SuccessMessageEnum,
} from "../../../../enum/message.enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { updateBook } from "../../../../services/book.services";
import {
  UpdateBookFormType,
  UpdateBookResponse,
} from "../../../../types/book/book.types";
import { getDisplayErrorMessage } from "../../../../utils/getDisplayErrorMessage";

function BookUpdateHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateBookFormType>();

  const { mutateAsync: updateBookMutation } = useMutation<
    UpdateBookResponse,
    AxiosError<unknown>,
    { id: number; data: FormData | Record<string, unknown> }
  >({
    mutationFn: async ({ id, data }) => updateBook(id, data),

    onSuccess: () => {
      onSuccessCommon(SuccessMessageEnum.BOOK_UPDATE_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BOOKS_USER],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      const errorMessage =
        getDisplayErrorMessage(error) || ErrorMessageEnum.BOOK_UPDATE_ERROR;

      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: UpdateBookFormType) => {
    const { id, title, description, author, releaseAt, coverUrl } = data;
    try {
      if (coverUrl instanceof File) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("author", author);
        formData.append("releaseAt", new Date(releaseAt).toISOString());
        formData.append("coverUrl", coverUrl);
        await updateBookMutation({ id: Number(id), data: formData });
      } else {
        await updateBookMutation({
          id: Number(id),
          data: {
            title,
            description,
            author,
            releaseAt,
            coverUrl,
          },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  return {
    submit,
    handleSubmit,
    control,
    reset,
    errors,
  };
}

export default BookUpdateHook;
