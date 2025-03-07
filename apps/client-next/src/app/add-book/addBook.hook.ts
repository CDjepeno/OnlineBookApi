import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { createBook } from "@/services/book.services";
import { AddBookForm } from "@/types/book/form.types";
import { AddBookResponse } from "@/types/book/response.types";
import { BookQueriesKeysEnum, RouterEnum } from "@/types/enum/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import * as yup from "yup";

interface ErrorResponse {
  message: string;
}

function BookAddHook() {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { user } = useContext(AuthContext) as AuthContextValue;

  const userId = user && user.id;

  const bookSchema = yup.object({
    title: yup.string().required("Le titre doit être renseigné"),
    description: yup.string().required("La description doit être renseignée"),
    author: yup.string().required("L'auteur doit être renseigné"),
    releaseAt: yup.string().required("La date de sortie doit être renseignée"),
    coverUrl: yup
      .mixed<FileList>()
      .required("L'image de couverture est requise")
      .test("fileSize", "L'image doit faire moins de 5MB", (value) =>
        value ? value[0].size <= 2000000 : true
      ),
  });

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

  const submit = async (data: AddBookForm) => {
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
    submit,
    bookSchema,
  };
}

export default BookAddHook;
