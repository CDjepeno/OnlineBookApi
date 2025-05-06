import { yupResolver } from "@hookform/resolvers/yup";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../../../../context";
import { BookQueriesKeysEnum, RouterEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { createBook } from "../../../../services/book.services";
import {
  AddBookFormType,
  AddBookInput,
  AddBookResponses,
  ErrorResponse,
} from "../../../../types/book/book.types";
import { AuthContextValue } from "../../../../types/user/auth.context.value";

const defaultValues: DefaultValues<AddBookFormType> = {
  title: "",
  description: "",
  author: "",
  releaseAt: new Date().toISOString(),
  coverUrl: undefined,
};

const bookSchema = yup.object({
  title: yup.string().required("Le nom doit être renseigné"),
  description: yup.string().required("La description doit être renseignée"),
  author: yup.string().required("L'auteur doit être renseigné"),
  releaseAt: yup.string().required("La date de sortie doit être renseignée"),
  coverUrl: yup
    .mixed<File>()
    .required("L'image de couverture est requise")
    .test("fileSize", "L'image doit faire moins de 5MB", (value) =>
      value ? value.size <= 5000000 : false
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
    AddBookResponses,
    AxiosError<unknown>,
    FormData
  >({
    mutationFn: async (data: FormData) => createBook(data, userId),

    onSuccess: (data) => {
      console.log("data", data);
      onSuccessCommon(data.message, RouterEnum.HOME);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.GET_BOOKS],
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
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("author", data.author);
      formData.append("releaseAt", data.releaseAt);

      if (data.coverUrl) {
        formData.append("coverUrl", data.coverUrl);
      } else {
        console.error("coverUrl is required");
        return;
      }

      const response = await addBook(formData);
      console.log("Reponse apres ajout du livre :", response);
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
