import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { createBook } from "@/services/book.services";
import { BookFormData } from "@/types/book/form.types";
import { AddBookResponse } from "@/types/book/response.types";
import { BookQueriesKeysEnum, RouterEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";

interface ErrorResponse {
  message: string;
}

function BookAddHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { user } = useContext(AuthContext) as AuthContextValue;

  const userId = user && user.id;

 

  const { mutateAsync: addBookMutation } = useMutation<
    AddBookResponse,
    AxiosError<unknown>,
    FormData
  >({
    mutationFn: async (data: FormData) => createBook(data, userId!),

    onSuccess: () => {
      onSuccessCommon("Votre livre a bien été créé", RouterEnum.HOME);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.GetBooks],
      });
    },
    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage = "Une erreur est survenue";

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
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("author", data.author);
        formData.append("releaseAt", data.releaseAt.toString());
        if (data.coverUrl && data.coverUrl instanceof File) {
          formData.append("coverUrl", data.coverUrl);
        } else {
          console.error("coverUrl is required");
          return;
        }
        
        await addBookMutation(formData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    onSubmit,
  };
}

export default BookAddHook;
