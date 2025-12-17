import {
  AddContactInput,
  ApiContactResponse,
} from "@/types/contact/contact.types";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useRequestApi";
import { CONTACT_ROUTE } from "../request/route-http/route-http";

export const createContact = async (data: AddContactInput) => {
  const response = await UseRequestApi<ApiContactResponse, AddContactInput>({
    method: MethodHttpEnum.POST,
    path: CONTACT_ROUTE,
    params: data,
    includeAuthorizationHeader: false,
  });
  return response.data;
};
