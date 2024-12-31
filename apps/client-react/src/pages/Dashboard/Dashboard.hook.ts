import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { BookingsQueriesKeysEnum } from "../../enum/enum";
import { AuthContextValue } from "../../interfaces/auth.context.value";
import { GetBookingsUser } from "../../services/booking.services";

function DashboardHook(page: number, limit: number) {
  const { user } = useContext(AuthContext) as AuthContextValue;
  console.log(page);
  const userId = user?.id.toString();
  const {
    data: bookingsU,
    isPending,
    error,
  } = useQuery({
    queryKey: [BookingsQueriesKeysEnum.GetBookingsUser, page],
    queryFn: () => GetBookingsUser(userId!, page, limit),
    enabled: !!user?.id,
  });
  const bookingsUser = bookingsU?.bookings
  const totalPages = bookingsU?.pagination.totalPages;
  return { bookingsUser, isPending, error, totalPages };
}

export default DashboardHook;
