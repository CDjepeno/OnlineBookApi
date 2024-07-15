export enum BookQueriesKeysEnum {
  GetBooks = 'getbooks',
  BooksUser = 'booksUser',
  Login = 'login',
  addBook = 'addBook',
  Book = 'book'
}

export enum UserQueriesKeysEnum {
  Login = 'login',
}

// Method HTTP
export enum MethodHttpEnum {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
  PATCH = 'patch',
}

// Router
export enum RouterEnum {
  LOGIN = '/Login',
  REGISTER = '/Register',
  ADD_BOOK = '/add-book',
  BOOK = '/book/:id',
  BOOK_USER = '/books/:userId',
  HOME = '/',
}