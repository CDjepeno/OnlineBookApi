import { GetBookingsUser } from "@/services/booking.services";
import { cookies } from "next/headers";
import DashboardDetail from "./DashboardDetail";
import { UseRequest } from "@/clients/axios/useRequest";
import { BASE_URL, CURRENT_USER_ROUTE } from "@/request/route-http/route-http";
import { MethodHttpEnum } from "@/types/enum/enum";
import { CurrentUserResponse } from "@/types/user/response.types";

export default async function Dashboard() {
  const limit = 6;
  const token = (await cookies()).get("BookTokenCookies")?.value;

  const user = await UseRequest<CurrentUserResponse, unknown >(
    BASE_URL,
    CURRENT_USER_ROUTE,
    MethodHttpEnum.GET,
    undefined,
    undefined,
    token 
  );
  
  const userBookings = await GetBookingsUser(user.id, 1, limit);

  
  return (
    <DashboardDetail
      userBookings={userBookings}
      initalPage={1}
      totalPages={userBookings.pagination.totalPages}
    />
  );
}
