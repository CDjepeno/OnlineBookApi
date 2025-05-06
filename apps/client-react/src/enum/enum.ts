//
export enum BookQueriesKeysEnum {
  GET_BOOKS = "getbooks",
  BOOKS_USER = "booksUser",
  LOGIN = "login",
  ADD_BOOK = "addBook",
  Book = "book",
}

export enum UserQueriesKeysEnum {
  LOGIN = "login",
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
  LOGIN = "/login",
  REGISTER = "/register",
  ADD_BOOK = "/add-book",
  BOOK = "/book/:id",
  BOOK_USER = "/books/:userId",
  HOME = "/",
}
