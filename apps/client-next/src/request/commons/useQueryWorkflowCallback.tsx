'use client'

import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

export const UseQueryWorkflowCallback = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSuccessCommon = useCallback(
    (message?: string, redirection?: string) => {
      const successMessage =  message;

      enqueueSnackbar(successMessage, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        style: {
          color: "white",
          minWidth: "100%",
        },
      });
      if (redirection) {
        router.push(redirection);

      }
    },
    [enqueueSnackbar, router]
  );

  const onErrorCommon = useCallback(
    (message?: string) => {
      const successMessage =  message;

      enqueueSnackbar(successMessage, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        style: {
          color: "white",
          minWidth: "100%",
        },
      });
    },
    [enqueueSnackbar]
  );

  return {
    onSuccessCommon,
    onErrorCommon
  };
};
