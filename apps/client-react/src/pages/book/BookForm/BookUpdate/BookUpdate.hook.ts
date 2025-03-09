import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { BookQueriesKeysEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { updateBook } from "../../../../services/book.services";
import {
  UpdateBookFormType,
  UpdateBookResponse,
} from "../../../../types/book/book.types";
import { convertImageUrlToBlob } from "../../../../utils/convertImageUrlToBinary";

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
    { id: string; data: FormData }
  >({
    mutationFn: async ({ id, data }) => updateBook(id, data),

    onSuccess: () => {
      onSuccessCommon("Le livre a été mis à jour avec succès");
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

  const submit = async (data: UpdateBookFormType) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("author", data.author);
      formData.append("releaseAt", new Date(data.releaseAt).toISOString());

      if (typeof data.coverUrl === "string") {
        const imageBlob = await convertImageUrlToBlob(data.coverUrl);

        if (imageBlob) {
          formData.append("coverUrl", imageBlob, data.coverUrl);
        }
      }
      if (data.coverUrl instanceof File) {
        formData.append("coverUrl", data.coverUrl);
      }

      const id = data && data.id;
      await updateBookMutation({ id, data: formData });
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
