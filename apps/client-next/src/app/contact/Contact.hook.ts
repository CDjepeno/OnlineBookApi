"use client"
import { UseQueryWorkflowCallback } from "@/request/commons/useQueryWorkflowCallback";
import { contact } from "@/services/contact.services";
import { ContactFormType } from "@/types/contact/form.types";
import { RouterEnum } from "@/types/enum/enum";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as yup from "yup";

function ContactHook() {
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();
  const router = useRouter();

  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez renseigner une adresse email valide")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Veuillez renseigner une adresse email valide"
      )
      .required("Veuillez renseigner une adresse email valide"),
    message: yup
      .string()
      .required("Veuillez confirmer le mot de passe")
      .min(10, "Votre message doit contenir au moins 10 caractères")
      .max(300, "Votre message doit contenir au max 300 caractères"),
    name: yup
      .string()
      .required("Le nom doit être renseigné")
      .min(2, "Le nom doit être explicite")
      .max(10, "Le nom doit être succinct"),
  });

  const { mutateAsync: sendContactMutation } = useMutation({
    mutationFn: (input: ContactFormType) => contact(input),
    onSuccess: (response) => {
      onSuccessCommon(
        response.msg
      );
      router.push(RouterEnum.HOME);
    },
    onError: () => {
      onErrorCommon("une erreur est survenue");
    },
  });

  const onSubmit = async (formData: ContactFormType) => {
    try {
      await sendContactMutation(formData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre", error);
      throw new Error("une erreur est survenue");
    }
  };

  return {
    onSubmit,
    signupSchema,
  };
}

export default ContactHook;
