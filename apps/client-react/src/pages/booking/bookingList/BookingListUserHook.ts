import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookingQueriesKeysEnum } from "../../../enum/enum";
import { getBookingsByUser } from "../../../services/booking.service";

function BookingListUserHook() {
  const { userId } = useParams<{ userId: string }>();
  console.log("userId", userId)

  const {
    data: bookings = [],
    isPending,
    error,
  } = useQuery({
    queryKey: [BookingQueriesKeysEnum.BOOKINGS_BY_USER, userId],
    queryFn: () => {
      if (!userId) throw new Error("ID utilisateur requis.");
      return getBookingsByUser(userId);
    },
    enabled: Boolean(userId),
  });
  console.log(bookings)

  return { bookings, isPending, error };
}

export default BookingListUserHook;

