import { GetBookingByBookResponse } from "../../types/booking/GetBookingByBookResponse";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookingQueriesKeysEnum } from "../../enum/enum";
import { getBookingsByBook } from "../../services/booking.service";

function BookBookingHook() {
  const { id } = useParams<{ id: string }>();

  const { data: bookings = [] } = useQuery<GetBookingByBookResponse[]>({
    queryKey: [BookingQueriesKeysEnum.BOOKINGS_BY_BOOK, id],
    queryFn: async () => {
      if (!id) throw new Error("L'ID du livre est requis");
      return await getBookingsByBook(id);
    },
    enabled: Boolean(id),
  });


  return { bookings };
}

export default BookBookingHook;
