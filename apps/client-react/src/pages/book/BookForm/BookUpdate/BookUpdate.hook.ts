import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { updateBook } from "../../../../services/book.services";
import {
  UpdateBookFormType,
  UpdateBookResponse,
} from "../../../../types/book/book.types";

interface ErrorResponse {
  message: string;
}

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
    { id: number; data: FormData }
  >({
    mutationFn: async ({ id, data }) => updateBook(id, data),

    onSuccess: () => {
      onSuccessCommon("Le livre a été mis à jour avec succès");
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BOOKS_USER],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la mise à jour du livre";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as ErrorResponse;
        if (responseData?.message) {
          errorMessage = responseData.message;
        }
      }

      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: UpdateBookFormType) => {
    try {
      const { id, title, description, author, releaseAt, coverUrl } = data;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("releaseAt", new Date(releaseAt).toISOString());

      if (typeof coverUrl === "string") {
        formData.append("coverUrl", coverUrl);
      } else if (coverUrl instanceof File) {
        formData.append("coverUrl", coverUrl);
      }

      await updateBookMutation({ id: Number(id), data: formData });
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
