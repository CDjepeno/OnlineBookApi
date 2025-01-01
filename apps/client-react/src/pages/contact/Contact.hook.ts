import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RouterEnum } from "src/enum/enum";
import { UseQueryWorkflowCallback } from "src/request/commons/useQueryWorkflowCallback";
import { contact } from "src/services/contact.services";
import { ContactFormType } from "src/types/contact/form.types";
import * as yup from "yup";

function ContactHook() {
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();
  const navigate = useNavigate();

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
      navigate(RouterEnum.HOME);
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
