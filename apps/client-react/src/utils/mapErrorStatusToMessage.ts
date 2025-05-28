import { ErrorMessageEnum } from "../enum/message.enum";

export function mapErrorStatusToMessage(status?: number): string {
  switch (status) {
    case 400:
      return ErrorMessageEnum.BAD_REQUEST;
    case 401:
      return ErrorMessageEnum.UNAUTHORIZED;
    case 403:
      return ErrorMessageEnum.FORBIDDEN;
    case 404:
      return ErrorMessageEnum.NOT_FOUND;
    case 409:
      return ErrorMessageEnum.CONFLICT;
    case 422:
      return ErrorMessageEnum.UNPROCESSABLE_ENTITY;
    case 500:
      return ErrorMessageEnum.INTERNAL_SERVER_ERROR;
    case 503:
      return ErrorMessageEnum.SERVICE_UNAVAILABLE;

    default:
      return ErrorMessageEnum.UNKNOWN_ERROR;
  }
}
