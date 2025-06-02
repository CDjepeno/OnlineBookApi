import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { RouterEnum } from "../../../enum/enum";
import { ErrorMessageEnum } from "../../../enum/message.enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { registerUser } from "../../../services/user.services";
import {
  RegisterFormInput,
  RegisterResponse,
} from "../../../types/user/form.types";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";

// Constantes pour éviter la duplication
const VALIDATION_MESSAGES = {
  email: {
    required: "L'adresse email est requise",
    invalid: "Veuillez renseigner une adresse email valide",
  },
  password: {
    required: "Le mot de passe est requis",
    minLength: "Le mot de passe doit contenir au moins 6 caractères",
  },
  confirmPassword: {
    required: "Veuillez confirmer le mot de passe",
    noMatch: "Les mots de passe ne correspondent pas",
  },
  name: {
    required: "Le nom est requis",
    minLength: "Le nom doit contenir au moins 2 caractères",
    maxLength: "Le nom ne peut pas dépasser 50 caractères",
  },
  phone: {
    required: "Le numéro de téléphone est requis",
    invalid: "Veuillez renseigner un numéro de téléphone valide",
  },
} as const;

const PASSWORD_MIN_LENGTH = 6;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

// Regex pour validation email plus robuste
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regex pour validation téléphone français
const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const defaultValues: RegisterFormInput = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  phone: "",
};

const signupSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.email.required)
    .email(VALIDATION_MESSAGES.email.invalid)
    .matches(EMAIL_REGEX, VALIDATION_MESSAGES.email.invalid),

  password: yup
    .string()
    .required(VALIDATION_MESSAGES.password.required)
    .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.password.minLength),

  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.confirmPassword.required)
    .oneOf([yup.ref("password")], VALIDATION_MESSAGES.confirmPassword.noMatch),

  name: yup
    .string()
    .required(VALIDATION_MESSAGES.name.required)
    .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.name.minLength)
    .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.name.maxLength)
    .trim(),

  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.phone.required)
    .matches(PHONE_REGEX, VALIDATION_MESSAGES.phone.invalid),
});

export default function RegisterHook() {
  const navigate = useNavigate();
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });

  const { mutateAsync: submit } = useMutation({
    mutationFn: (input: RegisterFormInput) => registerUser(input),
    onSuccess: (response: RegisterResponse) => {
      onSuccessCommon(response.data.message, RouterEnum.LOGIN);
      navigate(RouterEnum.LOGIN);
    },
    onError: (error: Error) => {
      const errorMessage =
        getDisplayErrorMessage(error) || ErrorMessageEnum.USER_CREATE_ERROR;

      onErrorCommon(errorMessage);
    },
  });

  const onSubmit = (input: RegisterFormInput) => {
    return submit(input);
  };

  return {
    onSubmit,
    register,
    handleSubmit,
    setError,
    watch,
    control,
    errors,
    isSubmitting,
  };
}
