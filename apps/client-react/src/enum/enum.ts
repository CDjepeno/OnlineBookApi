//
export enum BookQueriesKeysEnum {
  GET_BOOKS = "getbooks",
  BOOKS_USER = "booksUser",
  LOGIN = "login",
  ADD_BOOK = "addBook",
  Book = "book",
  BOOK_SEARCH = "bookSearch",
}

export enum BookingQueriesKeysEnum {
  BOOKINGS_BY_BOOK = "bookingsByBook",
  BOOKINGS_BY_USER = "bookingsByUser",
  ADD_BOOKING = "addBooking",
}

export enum UserQueriesKeysEnum {
  LOGIN = "login",
  GET_USER_BY_ID = "getUserById",
  // CURRENT_USER = "currentUser",
}

// Method HTTP
export enum MethodHttpEnum {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
}

// Router
export enum RouterEnum {
  HOME = "/",
  REGISTER = "/register",
  GOOGLE_CALLBACK = "/auth/google/callback",
  LOGIN = "/login",
  PROFILE = "/profile/:userId",
  ADD_BOOK = "/add-book",
  BOOK = "/book/:id",
  BOOK_USER = "/books/:userId",
  BOOKINGS_USER = "/bookings/user/:userId",
  CONTACT = "/contact",
}
