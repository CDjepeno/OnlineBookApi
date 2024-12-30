import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "src/context";
import { BookQueriesKeysEnum, RouterEnum } from "src/enum/enum";
import { AuthContextValue } from "src/interfaces/auth.context.value";
import { UseQueryWorkflowCallback } from "src/request/commons/useQueryWorkflowCallback";
import { createBook, updateBook } from "src/services/book.services";
import { BookForm } from "src/types/book/form.types";
import {
  AddBookResponse,
  UpdateBookResponse,
} from "src/types/book/response.types";
import * as yup from "yup";

interface ErrorResponse {
  message: string;
}

function BookUpdateAddHook(setIsFormOpen?: (value: boolean) => void) {
  // ////////////////////////Update Book

  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: updateBookMutation } = useMutation<
    UpdateBookResponse,
    AxiosError<unknown>,
    { id: number; data: FormData | Record<string, unknown> }
  >({
    mutationFn: async ({ id, data }) => updateBook(id, data),

    onSuccess: () => {
      if (setIsFormOpen) {
        setIsFormOpen(false);
      }
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

  // ////////////////////////Add Book
  const { user } = useContext(AuthContext) as AuthContextValue;

  const userId = user && user.id;

  const bookSchema = yup.object({
    name: yup.string().required("Le nom doit être renseigné"),
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
    mutationFn: async (data: FormData) => createBook(data, userId),

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

  const submit = async (data: BookForm) => {
    try {
      if (data.id) {
        const { id, name, description, author, releaseAt, coverUrl } = data;

        if (coverUrl instanceof FileList) {
          const data = new FormData();

          data.append("coverUrl", coverUrl[0]);
          data.append("name", name);
          data.append("description", description);
          data.append("author", author);
          data.append("releaseAt", releaseAt ? releaseAt.toString() : "");

          await updateBookMutation({ id, data });
        }
        await updateBookMutation({ id, data });
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("author", data.author);
        formData.append("releaseAt", data.releaseAt.toString());
        if (data.coverUrl && data.coverUrl.length > 0) {
          formData.append("coverUrl", data.coverUrl[0]);
        } else {
          console.error("coverUrl is required");
          return;
        }
        await addBookMutation(formData);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    submit,
    bookSchema,
  };
}

export default BookUpdateAddHook;
