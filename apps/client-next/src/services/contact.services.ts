import { UseRequestApi } from "@/request/commons/useApiRequest";
import { CONTACT_ROUTE } from "@/request/route-http/route-http";
import { ContactFormType } from "@/types/contact/form.types";
import { ContactResponse } from "@/types/contact/response.types";
import { MethodHttpEnum } from "@/types/enum/enum";

export const contact = async (
  input: ContactFormType
): Promise<ContactResponse> => {
  const params = input;
  return await UseRequestApi({
    method: MethodHttpEnum.POST,
    path: CONTACT_ROUTE,
    params,
    includeAuthorizationHeader: true,
  });
};
