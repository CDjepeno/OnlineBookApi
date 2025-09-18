import { AuthContextType } from "@/types/user/auth.context.type";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { RouterEnum } from "../../../enum/enum";
import { UseQueryWorkflowCallback } from "../../../request/commons/useQueryWorkflowCallback";
import { GoogleLoginInput } from "../../../types/user/input.types";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";

export default function LoginGoogleHook() {
  const { signinWithGoogle } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const { onErrorCommon } = UseQueryWorkflowCallback();

  const { mutateAsync: handleGoogleLogin } = useMutation({
    mutationFn: async (idToken: GoogleLoginInput) => {
      if (!idToken) throw new Error("ID Token Google manquant");
      await signinWithGoogle(idToken);
    },
    onSuccess: () => {
      navigate(RouterEnum.HOME, { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        getDisplayErrorMessage(error) || "Erreur lors du signin Google";
      onErrorCommon(errorMessage);
    },
  });

  return { handleGoogleLogin };
}
