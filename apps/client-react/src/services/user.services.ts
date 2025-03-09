import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import {
  CURRENT_USER_ROUTE,
  REGISTER_ROUTE,
} from "../request/route-http/route-http";
import { RegisterFormInput, RegisterResponse } from "../types/user/form.types";
import { CurrentUserResponse } from "../types/user/response.types";

export const registerUser = async (
  input: RegisterFormInput
): Promise<RegisterResponse> => {
  const params = input;
  return await UseRequestApi({
    method: MethodHttpEnum.POST,
    path: REGISTER_ROUTE,
    params,
    includeAuthorizationHeader: true,
  });
};

export const getCurrentUser = async () => {
  const response = await UseRequestApi<CurrentUserResponse, unknown>({
    method: MethodHttpEnum.GET,
    path: CURRENT_USER_ROUTE,
    includeAuthorizationHeader: true,
  });

  return response;
};
