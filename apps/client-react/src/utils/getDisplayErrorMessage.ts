import axios from "axios";
import { mapErrorStatusToMessage } from "./mapErrorStatusToMessage";

export function getDisplayErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as { message: string };

    if (responseData) {
      return responseData.message;
    }

    return mapErrorStatusToMessage(status);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inconnue est survenueeeeeeeeeee";
}
