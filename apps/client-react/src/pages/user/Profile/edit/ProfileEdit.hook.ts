import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserQueriesKeysEnum } from "../../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../../request/commons/useQueryWorkflowCallback";
import { updateUser } from "../../../../services/user.service";
import {
  UpdateUserDto,
  UpdateUserResponse,
} from "../../../../types/user/response.types";
import { getDisplayErrorMessage } from "../../../../utils/getDisplayErrorMessage";

export function ProfileEditHook(userId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserDto>();

  const { mutateAsync: updateUserMutation } = useMutation<
    UpdateUserResponse,
    AxiosError<unknown>,
    UpdateUserDto
  >({
    mutationFn: async (data) => updateUser(data),

    onSuccess: (response) => {
      onSuccessCommon(response.data.message);

      queryClient.invalidateQueries({
        queryKey: [UserQueriesKeysEnum.GET_USER_BY_ID, userId],
      });

      // Rediriger vers le profil
      navigate(`/profile/${userId}`);
    },

    onError: (error: Error | AxiosError<unknown>) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur est survenue lors de la mise à jour du profil";

      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: UpdateUserDto) => {
    try {
      await updateUserMutation(data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
    }
  };
  return {
    submit,
    handleSubmit,
    control,
    reset,
    errors,
  };
}

export default ProfileEditHook;
