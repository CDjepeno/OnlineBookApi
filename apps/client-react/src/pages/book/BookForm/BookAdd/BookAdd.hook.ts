import { yupResolver } from "@hookform/resolvers/yup";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { BookQueriesKeysEnum, RouterEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { createBook } from "../../../../services/book.services";
import {
  AddBookFormType,
  AddBookInput,
  AddBookResponse,
  ErrorResponse,
} from "../../../../types/book/book.types";
import { AuthContext } from "src/context";
import { AuthContextValue } from "src/types/user/auth.context.value";

const defaultValues: DefaultValues<AddBookFormType> = {
  name: "",
  description: "",
  author: "",
  releaseAt: "",
  coverUrl: undefined,
};

const bookSchema = yup.object({
  name: yup.string().required("Le nom doit être renseigné"),
  description: yup.string().required("La description doit être renseignée"),
  author: yup.string().required("L'auteur doit être renseigné"),
  sexe: yup.string().required("Le sexe doit être renseigné"),
  releaseAt: yup.string ().required("La date de sortie doit être renseignée"),
  coverUrl: yup
    .mixed<FileList>()
    .required("L'image de couverture est requise")
    .test("fileSize", "L'image doit faire moins de 5MB", (value) =>
      value ? value[0].size <= 2000000 : true
    ),
});

function BookAddHook() {
  const { user } = useContext(AuthContext) as AuthContextValue;
  const queryClient = new QueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBookFormType>({
    defaultValues,
    resolver: yupResolver(bookSchema),
  });

  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();
  const userId = user && user.id;

  const { mutateAsync: addBook } = useMutation<
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

      if (isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          (error.response.data as ErrorResponse).message
        ) {
          errorMessage = (error.response.data as ErrorResponse).message;
        }
      }

      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: AddBookInput) => {
    try {   
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
      await addBook(formData);
    } catch (error) {
      console.error("error addbook", error);
    }
  };

  return { register, submit, handleSubmit, isSubmitting, errors, control };
}

export default BookAddHook;

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    error.isAxiosError === true
  );
}
