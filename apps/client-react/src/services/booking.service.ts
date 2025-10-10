import {
  AddBookingInput,
  GetBookingByBookResponse,
} from "@/types/booking/GetBookingByBookResponse";
import { AxiosResponse } from "axios";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useRequestApi";
import {
  BOOKING_ROUTE,
  BOOKINGS_BY_BOOK_ROUTE,
  BOOKINGS_ROUTE,
} from "../request/route-http/route-http";

export const getBookingsByBook = async (
  bookId: string
): Promise<GetBookingByBookResponse[]> => {
  const response = await UseRequestApi<
    { data: GetBookingByBookResponse[] },
    { bookId: string }
  >({
    path: `${BOOKINGS_BY_BOOK_ROUTE}/${bookId}/${BOOKINGS_ROUTE}`,
    method: MethodHttpEnum.GET,
    includeAuthorizationHeader: false,
  });

  return response.data;
};

export const createBooking = async (
  data: AddBookingInput,
  userId: number | null
) => {
  const payload = {
    ...data,
    userId,
  };
  const response: AxiosResponse = await UseRequestApi({
    method: MethodHttpEnum.POST,
    path: BOOKING_ROUTE,
    params: payload,
    includeAuthorizationHeader: true,
  });

  return response.data;
};
