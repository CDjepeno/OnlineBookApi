import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { BookingsQueriesKeysEnum } from "../../enum/enum";
import { GetBookingsUser } from "../../services/booking.services";
import { AuthContextValue } from "../../types/user/auth.context.value";

function DashboardHook() {
  const { user } = useContext(AuthContext) as AuthContextValue;
  console.log(typeof user?.id);
  const userId = user?.id.toString()
  const {
    data: bookingsUser,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookingsQueriesKeysEnum.GetBookingsUser],
    queryFn: () => GetBookingsUser(userId!),
    enabled: !!user?.id,
  });

  return { bookingsUser, isPending, error };
}

export default DashboardHook;
