import { BookingBookFormType } from "src/types/booking/form.types";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import {
  BOOKING_BOOK_ROUTE,
  GET_BOOKINGS_BOOK_ROUTE,
  GET_BOOKINGS_USER_ROUTE,
} from "../request/route-http/route-http";
import { BookingBookResponse, GetBookingsBookResponse, GetBookingUserPaginationResponse } from "src/types/booking/response.types";


export const getBookingsBook = async (
  id: string
): Promise<GetBookingsBookResponse[]> => {
  return await UseRequestApi<GetBookingsBookResponse[], { id: string }>({
    path: `${GET_BOOKINGS_BOOK_ROUTE}/${id}`,
    method: MethodHttpEnum.GET,
    params: { id },
    includeAuthorizationHeader: false,
  });
};

export const BookingBook = async (
  data: BookingBookFormType
): Promise<BookingBookResponse> => {
  return await UseRequestApi<BookingBookResponse, BookingBookFormType>({
    path: BOOKING_BOOK_ROUTE,
    method: MethodHttpEnum.POST,
    params: data,
    includeAuthorizationHeader: true,
  });
};

export const GetBookingsUser = async (
  id: string,
  page: number,
  limit: number,
): Promise<GetBookingUserPaginationResponse> => {
  return await UseRequestApi<GetBookingUserPaginationResponse, { id: string }>({
    path: `${GET_BOOKINGS_USER_ROUTE}/${id}?page=${page}?limit=${limit}`,
    method: MethodHttpEnum.GET,
    params: { id },
    includeAuthorizationHeader: true,
  });
};
