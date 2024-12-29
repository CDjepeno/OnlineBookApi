import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserQueriesKeysEnum } from "src/enum/enum";
import { UseQueryWorkflowCallback } from "src/request/commons/useQueryWorkflowCallback";
import { updateUser } from "src/services/user.services";
import {
  UpdateUserFormInput,
  UpdateUserFormType,
} from "src/types/user/form.types";
import { UpdateUserResponse } from "src/types/user/response.types";

interface ErrorResponse {
  message: string;
}

function UserUpdateHook(setIsFormOpen: (value: boolean) => void) {
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: updateUserMutation } = useMutation<
    UpdateUserResponse,
    AxiosError<unknown>,
    { id: number; data: UpdateUserFormInput }
  >({
    mutationFn: async ({id, data}) =>
      updateUser(id, data),

    onSuccess: () => {
      setIsFormOpen(false);
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

  const submit = async (formData: UpdateUserFormType) => {
    try {
      console.log(formData);
      
      await updateUserMutation({id:formData.id, data:formData});
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    submit,
  };
}

export default UserUpdateHook;
