import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "../../../../types/book/book.types";
import { AuthContextValue } from "../../../../types/user/auth.context.value";
import { getDisplayErrorMessage } from "../../../../utils/getDisplayErrorMessage";

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
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
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
      onSuccessCommon(data.message, RouterEnum.HOME);
      queryClient.invalidateQueries({
        queryKey: [BookQueriesKeysEnum.GET_BOOKS],
      });
    },
    onError: (error: Error | AxiosError<unknown>) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur est survenue lors de la création du livre";

      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: AddBookInput) => {
    const { title, description, author, releaseAt, coverUrl } = data;
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("releaseAt", releaseAt);

      if (coverUrl) {
        formData.append("coverUrl", coverUrl);
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

  return {
    register,
    submit,
    handleSubmit,
    watch,
    isSubmitting,
    errors,
    control,
  };
}

export default BookAddHook;
