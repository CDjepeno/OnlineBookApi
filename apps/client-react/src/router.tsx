import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "./App";
import { RouterEnum } from "./enum/enum";
import BookDetail from "./pages/book/BookDetail/BookDetail";
import AddBook from "./pages/book/BookForm/BookAdd/BookAddForm";
import BookUser from "./pages/book/BookList/BookListUser";
import BookingsUser from "./pages/booking/bookingList/BookingListUser";
import AddContactForm from "./pages/contact/AddContactForm";
import { HomePage } from "./pages/Homepage/HomePage";
import Login from "./pages/user/Login/Login";
import { Profile } from "./pages/user/Profile/Profile";
import Register from "./pages/user/Register/Register";
import PrivateRoute from "./Private-route";

type CustomRouteObject = RouteObject & {
  element: JSX.Element;
};

const routes: CustomRouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: RouterEnum.HOME, element: <HomePage /> },
      { path: RouterEnum.GOOGLE_CALLBACK, element: <Login /> },
      { path: RouterEnum.REGISTER, element: <Register /> },
      { path: RouterEnum.LOGIN, element: <Login /> },
      {
        path: RouterEnum.PROFILE,
        element: <PrivateRoute element={<Profile />} />,
      },

      {
        path: RouterEnum.ADD_BOOK,
        element: <PrivateRoute element={<AddBook />} />,
      },
      { path: RouterEnum.BOOK, element: <BookDetail /> },
      {
        path: RouterEnum.BOOK_USER,
        element: <PrivateRoute element={<BookUser />} />,
      },
      {
        path: RouterEnum.BOOKINGS_USER,
        element: <PrivateRoute element={<BookingsUser />} />,
      },
      { path: RouterEnum.CONTACT, element: <AddContactForm /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
