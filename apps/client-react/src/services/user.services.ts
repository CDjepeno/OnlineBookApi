import { UserFormInput } from "src/types/user/input.types";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import {
  CURRENT_USER_ROUTE,
  GET_USER_BY_ID_ROUTE,
  REGISTER_ROUTE,
  USER_ROUTE,
} from "../request/route-http/route-http";
import { CurrentUserResponse, GetUserByIdResponse, RegisterResponse, UpdateUserResponse } from "../types/user/response.types";

export const registerUser = async (
  input: UserFormInput
): Promise<RegisterResponse> => {
  const params = input;
  return await UseRequestApi({
    method: MethodHttpEnum.POST,
    path: REGISTER_ROUTE,
    params,
    includeAuthorizationHeader: true,
  });
};

export const updateUser = async (
  id: number,
  data: UserFormInput ,
): Promise<UpdateUserResponse> => {
  return await UseRequestApi({
    method: MethodHttpEnum.PUT,
    path: `${USER_ROUTE}/${id}`,
    params: data,
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

export const getUserById = async (id:string) => {
  const response = await UseRequestApi<GetUserByIdResponse, { id: string }>({
    method: MethodHttpEnum.GET,
    path: `${GET_USER_BY_ID_ROUTE}/${id}`,
    includeAuthorizationHeader: true,
  });

  return response;
};
