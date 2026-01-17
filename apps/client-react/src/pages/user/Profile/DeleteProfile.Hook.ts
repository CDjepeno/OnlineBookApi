import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context";
import { RouterEnum, UserQueriesKeysEnum } from "../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { deleteUser } from "../../../services/user.service";
import { AuthContextType } from "../../../types/user/auth.context.type";
import { DeletProfileResponse } from "../../../types/user/response.types";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";

function DeleteProfileHook(userId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { signout } = useContext(AuthContext) as AuthContextType;
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: deleteProfileMutation, isPending: isDeleting } =
    useMutation<DeletProfileResponse, AxiosError<unknown>>({
      mutationFn: async () => deleteUser(userId),

      onSuccess: (response) => {
        onSuccessCommon(response.data.message);

        queryClient.invalidateQueries({
          queryKey: [UserQueriesKeysEnum.GET_USER_BY_ID],
        });

        signout();

        navigate(RouterEnum.HOME);
      },

      onError: (error: Error | AxiosError<unknown>) => {
        const errorMessage =
          getDisplayErrorMessage(error) ||
          "Une erreur est survenue lors de la suppression du compte";

        onErrorCommon(errorMessage);
      },
    });

  const submit = async () => {
    try {
      await deleteProfileMutation();
    } catch (error) {
      console.error(" Erreur lors de la suppression du compte", error);
    }
  };

  return {
    isDeleting,
    submit,
  };
}

export default DeleteProfileHook;
