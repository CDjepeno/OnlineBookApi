import { MethodHttpEnum } from "src/enum/enum";
import { UseRequestApi } from "src/request/commons/useApiRequest";
import { CONTACT_ROUTE } from "src/request/route-http/route-http";
import { ContactFormType } from "src/types/contact/form.types";
import { ContactResponse } from "src/types/contact/response.types";

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
