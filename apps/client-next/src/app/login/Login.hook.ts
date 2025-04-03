"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { LoginFormInput, VerifyOtpFormInput } from "@/types/user/input.types";
import { useRouter } from "next/navigation"; // Remplace useNavigate
import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { RouterEnum } from "@/types/enum/enum";
import { ErrorResponse } from "@/types/book/response.types";
import { googleCallback } from "@/services/user.services";
import Cookies from "js-cookie";
import { ErrorsMessagesEnum } from "@/enums/errorMessage.enum";


export default function LoginHook() {
  const { signin, verifyOtp, getUser } = useContext(AuthContext) as AuthContextValue;

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Il faut préciser votre email")
      .email("l'email n'est pas valide"),
    password: yup
      .string()
      .required("Il faut préciser votre mot de passe")
      .min(6, "Mot de passe trop court"),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    control,
    setValue,
  } = useForm<LoginFormInput>({ resolver: yupResolver(validationSchema) });

  const { onErrorCommon, onSuccessCommon } = UseQueryWorkflowCallback();
  const router = useRouter();

  const { mutateAsync: submitLogin } = useMutation({
    mutationFn: async (input: LoginFormInput) => {
      const response = await signin(input);
      return response;
    },
    onSuccess: async (response) => {
      onSuccessCommon(response.msg);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data) {
        const errorData = error.response.data.message;
        onErrorCommon(errorData);
        clearErrors();
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
    },
  });

  const { mutateAsync: submitVerifyOtp } = useMutation({
    mutationFn: async (input: VerifyOtpFormInput) => verifyOtp(input),
    onSuccess: async () => {
      router.push(RouterEnum.HOME);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data) {
        const errorData = error.response.data.message;
        onErrorCommon(errorData);
        clearErrors();
      } else {
        onErrorCommon("Problème avec la connexion réseau");
      }
    },
  });

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

  const onSubmitLogin = (input: LoginFormInput) => {
    return submitLogin(input);
  };
  const onSubmitVerifyOtp = (input: VerifyOtpFormInput) => {
    return submitVerifyOtp(input);
  };
  const onSubmitCallBackGoogle = (input: string) => {
    return callbackGoogle(input);
  };

  return {
    handleSubmit,
    onSubmitLogin,
    onSubmitVerifyOtp,
    onSubmitCallBackGoogle,
    errors,
    isSubmitting,
    control,
    setValue,
  };
}
