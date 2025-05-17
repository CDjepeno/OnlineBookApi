import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { updateBook } from "../../../../services/book.services";
import {
  ErrorResponse,
  UpdateBookFormType,
  UpdateBookResponse,
} from "../../../../types/book/book.types";

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
    AxiosError<ErrorResponse>,
    { id: number; data: FormData }
  >({
    mutationFn: async ({ id, data }) => updateBook(id, data),

    onSuccess: () => {
      onSuccessCommon("Le livre a été mis à jour avec succès");

      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.BOOKS_USER],
      });
    },

    onError: (error) => {
      let errorMessage =
        "Une erreur est survenue lors de la mise à jour du livre";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

      if (coverUrl instanceof File) {
        formData.append("coverUrl", coverUrl);
      } else if (typeof coverUrl === "string" && coverUrl.startsWith("http")) {
        formData.append("coverUrl", coverUrl);
      }

      await updateBookMutation({ id: Number(id), data: formData });
    } catch (error) {
      console.error("error updating book", error);
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
