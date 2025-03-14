import { useMutation } from "@tanstack/react-query";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { UserFormInput } from "@/types/user/input.types";
import { registerUser } from "@/services/user.services";
import { RouterEnum } from "@/types/enum/enum";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/book/response.types";
import { ErrorsMessagesEnum } from "@/enums/errorMessage.enum";

export default function RegisterHook() {
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: submit } = useMutation({
    mutationFn: (input: UserFormInput) => registerUser(input),
    onSuccess: (response) => {
      onSuccessCommon(response.msg, RouterEnum.LOGIN);
    },
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const errorData = (error.response.data as ErrorResponse).message;
        onErrorCommon(errorData);
      } else {
        onErrorCommon(ErrorsMessagesEnum.INTERNAL_SERVER_ERROR);
      }
    },
  });

  const onSubmit = (input: UserFormInput) => {
    return submit(input);
  };

  return {
    onSubmit,
  };
}
