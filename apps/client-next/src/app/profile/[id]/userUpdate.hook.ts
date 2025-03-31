import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { deleteUser, updateUser } from "@/services/user.services";
import { RouterEnum, UserQueriesKeysEnum } from "@/types/enum/enum";
import { UserFormInput, UserFromData } from "@/types/user/input.types";
import { UpdateUserResponse } from "@/types/user/response.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";

interface ErrorResponse {
  message: string;
}

function UserUpdateHook(setIsFormUpdateUserOpen: (value: boolean) => void) {
  /////////////////// Update
  const queryClient = useQueryClient();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();
    const { setUser } = useContext(AuthContext) as AuthContextValue;
  

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

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: (id: number) => deleteUser(id),

    onSuccess: (response) => {
      localStorage.removeItem("BookToken");
      localStorage.removeItem("RefreshToken");
      Cookies.remove("BookTokenCookies");
      Cookies.remove("BookRefreshTokenCookies");
      setUser(null)
      onSuccessCommon(response.msg, RouterEnum.HOME);
    },

    onError: (error: Error | AxiosError<unknown>) => {
      let errorMessage =
        "Une erreur est survenue lors de la suppression des livre";

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
    deleteUserMutation,
  };
}

export default UserUpdateHook;
