import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { RouterEnum } from "../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { registerUser } from "../../../services/user.services";
import { RegisterFormInput } from "../../../types/user/form.types";

export default function RegisterHook() {
  const navigate = useNavigate();

  const defaultValues: RegisterFormInput = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    sexe: "",
  };

  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez renseigner une adresse email valide")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Veuillez renseigner une adresse email valide"
      )
      .required("Veuillez renseigner une adresse email valide"),
    password: yup
      .string()
      .required("Veuillez renseigner un mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: yup
      .string()
      .required("Veuillez confirmer le mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    name: yup
      .string()
      .required("Le nom doit être renseigné")
      .min(2, "Le nom doit être explicite")
      .max(10, "Le titre doit être succinct"),
    phone: yup.string().required("Veuillez renseigner un numero valide"),
    sexe: yup.string().required("Veuillez renseigner un numero valide"),
  });

  const {
    register,
    handleSubmit,
    setError,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: yupResolver(signupSchema) });

  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return password === value || "Les mots de passe ne correspondent pas.";
  };
  const { onSuccessCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: submit } = useMutation({
    mutationFn: (input: RegisterFormInput) => registerUser(input),
    onSuccess: () => {
      onSuccessCommon(
        "Votre compte a bien ete cree!, un mail vous a été envoyer"
      );
      navigate(RouterEnum.LOGIN);
    },
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const isPasswordMatch = password === confirmPassword;

  const handleConfirmPasswordChange = () => {
    if (!isPasswordMatch) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les mots de passe ne correspondent pas.",
      });
    }
  };

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
    handleConfirmPasswordChange,
    isPasswordMatch,
    validatePasswordMatch,
  };
}
