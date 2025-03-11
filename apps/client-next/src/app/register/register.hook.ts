import { useMutation } from "@tanstack/react-query";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { UserFormInput } from "@/types/user/input.types";
import { registerUser } from "@/services/user.services";
import { RouterEnum } from "@/types/enum/enum";

export default function RegisterHook() {

  const { onSuccessCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: submit } = useMutation({
    mutationFn: (input: UserFormInput) => registerUser(input),
    onSuccess: (response) => {
      onSuccessCommon(
        response.msg,
        RouterEnum.LOGIN,
      );
    },
  });

  const onSubmit = (input: UserFormInput) => {
    return submit(input);
  };

  return {
    onSubmit,
  };
}