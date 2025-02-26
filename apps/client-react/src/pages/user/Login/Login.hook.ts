import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormInput, VerifyOtpFormInput } from "src/types/user/input.types";
import * as yup from "yup";
import { AuthContext } from "../../../context";
import { RouterEnum } from "../../../enum/enum";
import { AuthContextValue } from "../../../interfaces/auth.context.value";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";

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
    register,
    formState: { errors, isSubmitting },
    clearErrors,
    control,
  } = useForm<LoginFormInput>({ resolver: yupResolver(validationSchema) });

  const { onErrorCommon, onSuccessCommon } = UseQueryWorkflowCallback();
  const navigate = useNavigate();

  const { mutateAsync: submitLogin } = useMutation({
    mutationFn: async (input: LoginFormInput) => signin(input),
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
    }
  });

  const { mutateAsync: submitVerifyOtp } = useMutation({
    mutationFn: async (input: VerifyOtpFormInput) => verifyOtp(input),
    onSuccess: async () => {
      navigate(RouterEnum.HOME)
    },
    onError: (error) => {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response!.status === 401
      ) {
        onErrorCommon(error.message);
        clearErrors();
      }
    }
  });

  const onSubmitLogin = (input: LoginFormInput) => {
      return submitLogin(input);
  };
  const onSubmitVerifyOtp = (input: VerifyOtpFormInput) => {
    return submitVerifyOtp(input)
  };

  return {
    handleSubmit,
    register,
    onSubmitLogin,
    onSubmitVerifyOtp,
    errors,
    isSubmitting,
    control,
  };
}
