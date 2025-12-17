import {
  AddContactInput,
  AddContactResponses,
} from "@/types/contact/contact.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DefaultValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { UseQueryWorkflowCallback } from "../../request/commons/useQueryWorkflowCallback";
import { createContact } from "../../services/contact.service";
import { getDisplayErrorMessage } from "../../utils/getDisplayErrorMessage";

const defaultValues: DefaultValues<AddContactInput> = {
  name: "",
  email: "",
  message: "",
};

const contactSchema = yup.object({
  name: yup.string().required("Le nom doit être renseigné"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  message: yup.string().required("Le message est requis"),
});

function AddContactHook() {
  const { onSuccessCommon, onErrorCommon } = UseQueryWorkflowCallback();

  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddContactInput>({
    defaultValues,
    resolver: yupResolver(contactSchema),
  });

  const { mutateAsync: addcontact } = useMutation<
    AddContactResponses,
    AxiosError<unknown>,
    AddContactInput
  >({
    mutationFn: async (data: AddContactInput) => createContact(data),

    onSuccess: (data) => {
      onSuccessCommon(data.message);
      reset(defaultValues);
    },

    onError: (error: Error | AxiosError<unknown>) => {
      const errorMessage =
        getDisplayErrorMessage(error) ||
        "Une erreur lors de l'envoi du message";
      onErrorCommon(errorMessage);
    },
  });

  const submit = async (data: AddContactInput) => {
    try {
      await addcontact(data);
    } catch (error) {
      console.log("Erreur createContact :", error);
    }
  };

  return {
    control,
    submit,
    handleSubmit,
    watch,
    reset,
    isSubmitting,
    errors,
  };
}

export default AddContactHook;
