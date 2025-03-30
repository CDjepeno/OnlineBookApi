import { UseRequest } from "@/clients/axios/useRequest";
import { BASE_URL, CURRENT_USER_ROUTE } from "@/request/route-http/route-http";
import { getBooksByUser } from "@/services/book.services";
import { MethodHttpEnum } from "@/types/enum/enum";
import { CurrentUserResponse } from "@/types/user/response.types";
import { cookies } from "next/headers";
import ProfileDetail from "./profileDetail";

export default async function Profile() {
  const token = (await cookies()).get("BookTokenCookies")?.value;
  const user = await UseRequest<CurrentUserResponse, unknown>(
    BASE_URL,
    CURRENT_USER_ROUTE,
    MethodHttpEnum.GET,
    undefined,
    undefined,
    token
  );
  const limit = 6;

  const booksPaginate = await getBooksByUser(user.id, 1, limit);

  return (
    <ProfileDetail
      booksPagination={booksPaginate}
      initalPage={1}
      totalPages={booksPaginate.pagination.totalPages}
      user={user}
    />
  );
}
