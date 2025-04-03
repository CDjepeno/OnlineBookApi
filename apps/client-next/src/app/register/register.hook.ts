import { ErrorsMessagesEnum } from "@/enums/errorMessage.enum";
import { googleCallback, registerUser } from "@/services/user.services";
import { ErrorResponse } from "@/types/book/response.types";
import { RouterEnum } from "@/types/enum/enum";
import { UserFormInput } from "@/types/user/input.types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { useContext } from "react";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";

export default function RegisterHook() {
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();
    const { getUser } = useContext(AuthContext) as AuthContextValue;
  

  const { mutateAsync: callbackGoogle } = useMutation({
    mutationFn: (input: string) => googleCallback(input),
    onSuccess: (response) => {
      localStorage.setItem("BookToken", JSON.stringify(response.token));
      localStorage.setItem(
        "RefreshToken",
        JSON.stringify(response.refreshToken)
      );
      Cookies.set("BookTokenCookies", response.token, { expires: 7 }); 
      Cookies.set("BookRefreshTokenCookies", response.refreshToken, {
        expires: 7,
      }); 
      getUser()
      onSuccessCommon(response.msg, `${RouterEnum.PROFILE}/${response.userId}`);
      // onSuccessCommon(response.msg, RouterEnum.HOME);
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
    callbackGoogle,
  };
}
