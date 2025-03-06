"use client"
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

export default function LoginHook() {
  const { signin, verifyOtp } = useContext(AuthContext) as AuthContextValue;

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
    setValue
  } = useForm<LoginFormInput>({ resolver: yupResolver(validationSchema),
   });

  const { onErrorCommon, onSuccessCommon } = UseQueryWorkflowCallback();
  const router = useRouter();

  const { mutateAsync: submitLogin } = useMutation({
    mutationFn: async (input: LoginFormInput) => {
      console.log("Executing useMutation", input)
      const response = await signin(input);
      console.log("Executing useMutation", input);
      // return signin(input)
      return response
    },
    onSuccess: async (response) => {
      onSuccessCommon(response.msg);
    },
    onError: (error) => {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response!.status === 401
      ) {
        onErrorCommon(error.message);
        clearErrors();
      }
    },
  });

  const { mutateAsync: submitVerifyOtp } = useMutation({
    mutationFn: async (input: VerifyOtpFormInput) => verifyOtp(input),
    onSuccess: async () => {
      router.push(RouterEnum.HOME);
    },
    onError: (error) => {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response!.status === 401
      ) {
        onErrorCommon(error.message);
        clearErrors();
      }
    },
  });

  const onSubmitLogin = (input: LoginFormInput) => {
    console.log("OnSubmit login hook");

    return submitLogin(input);
  };
  const onSubmitVerifyOtp = (input: VerifyOtpFormInput) => {
    return submitVerifyOtp(input);
  };

  return {
    handleSubmit,
    onSubmitLogin,
    onSubmitVerifyOtp,
    errors,
    isSubmitting,
    control,
    setValue
  };
}
