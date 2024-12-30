import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { RouterEnum, UserQueriesKeysEnum } from "src/enum/enum";
import { UseQueryWorkflowCallback } from "src/request/commons/useQueryWorkflowCallback";
import { registerUser, updateUser } from "src/services/user.services";
import { UpdateUserInput, UserFormInput } from "src/types/user/input.types";
import { UpdateUserResponse } from "src/types/user/response.types";
import * as yup from "yup";

interface ErrorResponse {
  message: string;
}

function UserUpdateRegisterHook(setIsFormOpen?: (value: boolean) => void) {
  /////////////////// Update
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: updateUserMutation } = useMutation<
    UpdateUserResponse,
    AxiosError<unknown>,
    { id: number; data: UpdateUserInput }
  >({
    mutationFn: async ({ id, data }) => updateUser(id, data),

    onSuccess: () => {
      if (setIsFormOpen) {
        setIsFormOpen(false);
      }
      onSuccessCommon("L'utilisateur a été mis à jour avec succès");
      queryClient.invalidateQueries({
        queryKey: [UserQueriesKeysEnum.GetUserByID],
      });
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la mise à jour de l'utilisateur";

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

  //////////////////// Register

  const navigate = useNavigate();

  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez renseigner une adresse email valide")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Veuillez renseigner une adresse email valide"
      )
      .required("Veuillez renseigner une adresse email valide"),
    password: yup
      .string()
      .required("Veuillez renseigner un mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: yup
      .string()
      .required("Veuillez confirmer le mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    name: yup
      .string()
      .required("Le nom doit être renseigné")
      .min(2, "Le nom doit être explicite")
      .max(10, "Le titre doit être succinct"),
    phone: yup.string().required("Veuillez renseigner un numero valide"),
    sexe: yup.string().required("Veuillez renseigner un numero valide"),
  });

  const { mutateAsync: createUserMutation } = useMutation({
    mutationFn: (input: UserFormInput) => registerUser(input),
    onSuccess: () => {
      onSuccessCommon(
        "Votre compte a bien ete cree!, un mail vous a été envoyer"
      );
      navigate(RouterEnum.LOGIN);
    },
  });

  const onSubmit = async (formData: UserFormInput) => {
    try {
      if (formData.id) {
        console.log('upadateeeeeeeeeee');
        
        await updateUserMutation({ id: formData.id, data: formData });
      } else {
        console.log('createeeeeeeeeeee');
        await createUserMutation(formData);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    onSubmit,
    signupSchema,
  };
}

export default UserUpdateRegisterHook;
