import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AuthContext } from "../../../context";
import { RouterEnum } from "../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { AuthContextValue } from "../../../types/user/auth.context.value";
import { AuthFormInput } from "../../../types/user/input.types";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";

export type LoginFormType = {
  email: string;
  password: string;
};

const VALIDATION_MESSAGES = {
  email: {
    required: "Il faut préciser votre email",
    invalid: "L'email n'est pas valide",
  },
  password: {
    required: "Il faut préciser votre mot de passe",
    minLength: "Mot de passe trop court",
  },
} as const;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_MIN_LENGTH = 6;

const defaultValues: LoginFormType = {
  email: "",
  password: "",
};

const validationSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.email.required)
    .email(VALIDATION_MESSAGES.email.invalid)
    .matches(EMAIL_REGEX, VALIDATION_MESSAGES.email.invalid),

  password: yup
    .string()
    .required(VALIDATION_MESSAGES.password.required)
    .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.password.minLength),
});

export default function LoginHook() {
  const { signin } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();
  const { onErrorCommon } = UseQueryWorkflowCallback();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    clearErrors,
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutateAsync: submit } = useMutation({
    mutationFn: async (input: AuthFormInput) => signin(input),
    onSuccess: async () => {
      navigate(RouterEnum.HOME);
    },
    onError: (error) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur est survenue lors de la connexion d'utilisateur";
      onErrorCommon(errorMessage);
      clearErrors();
    },
  });

  const onSubmit = (input: AuthFormInput) => {
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
