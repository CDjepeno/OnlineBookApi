import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormInput } from "src/types/user/input.types";
import * as yup from "yup";
import { AuthContext } from "../../../context";
import { RouterEnum } from "../../../enum/enum";
import { AuthContextValue } from "../../../interfaces/auth.context.value";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";

export default function LoginHook() {
  const { signin } = useContext(AuthContext) as AuthContextValue;

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

  const { onErrorCommon } = UseQueryWorkflowCallback();
  const navigate = useNavigate();

  const { mutateAsync: submit } = useMutation({
    mutationFn: async (input: LoginFormInput) => signin(input),
    onError: (error) => {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response!.status === 401
      ) {
        onErrorCommon("Mauvais email/mot de passe!");
        clearErrors();
      }
    },
    onSuccess: async () => {
      navigate(RouterEnum.HOME);
    },
  });

  const onSubmit = (input: LoginFormInput) => {
    return submit(input);
  };

  return {
    handleSubmit,
    register,
    onSubmit,
    errors,
    isSubmitting,
    control,
  };
}
