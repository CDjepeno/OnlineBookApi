import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useRequestApi";
import {
  CURRENT_USER_ROUTE,
  REGISTER_ROUTE,
  USER_ROUTE,
  USER_ROUTES,
} from "../request/route-http/route-http";
import { RegisterFormInput, RegisterResponse } from "../types/user/form.types";
import {
  CurrentUserResponse,
  DeletProfileResponse,
  UpdateUserDto,
  UpdateUserResponse,
} from "../types/user/response.types";

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

export const getUserById = async (
  userId: string
): Promise<CurrentUserResponse> => {
  const response = await UseRequestApi<CurrentUserResponse, unknown>({
    method: MethodHttpEnum.GET,
    path: `${USER_ROUTE}/${userId}`,
    includeAuthorizationHeader: true,
  });

  return response;
};

export const updateUser = async (
  data: UpdateUserDto
): Promise<UpdateUserResponse> => {
  const response = await UseRequestApi<UpdateUserResponse, UpdateUserDto>({
    method: MethodHttpEnum.PUT,
    path: `${USER_ROUTE}/profile`,
    params: data,
    includeAuthorizationHeader: true,
  });

  return response;
};

export const deleteUser = async (userId: string): Promise<DeletProfileResponse> => {
  const response = await UseRequestApi<DeletProfileResponse, unknown>({
    method: MethodHttpEnum.DELETE,
    path: `${USER_ROUTES}/${userId}`,
    includeAuthorizationHeader: true,
  });

  return response;
};
