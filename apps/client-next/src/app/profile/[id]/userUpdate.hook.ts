import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { updateUser } from "@/services/user.services";
import { UserQueriesKeysEnum } from "@/types/enum/enum";
import { UserFormInput, UserFromData } from "@/types/user/input.types";
import { UpdateUserResponse } from "@/types/user/response.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

function UserUpdateHook(setIsFormUpdateUserOpen: (value: boolean) => void) {
  /////////////////// Update
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: updateUserMutation } = useMutation<
    UpdateUserResponse,
    AxiosError<unknown>,
    { id: number; data: UserFormInput }
  >({
    mutationFn: async ({ id, data }) => updateUser(id, data),

    onSuccess: (res) => {
        onSuccessCommon(res.msg);
        queryClient.invalidateQueries({
            queryKey: [UserQueriesKeysEnum.GetUserByID],
        });
        setIsFormUpdateUserOpen(false);
    },

   onError: (error: AxiosError) => {
         if (error.response?.data) {
           const errorData = (error.response.data as ErrorResponse).message;
           onErrorCommon(errorData);
         } else {
           onErrorCommon("Problème avec la connexion réseau");
         }
       },
});

 

  const onSubmit = async (formData: UserFromData) => {
    try {
      console.log("update user", formData);
      console.log(formData);
      
      await updateUserMutation({ id: formData.id!, data: formData });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
    }
  };

  return {
    onSubmit,
  };
}

export default UserUpdateHook;
