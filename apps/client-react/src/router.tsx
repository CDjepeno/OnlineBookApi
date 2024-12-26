import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "./App";
import { RouterEnum } from "./enum/enum";
import BookDetail from "./pages/book/BookDetail/BookDetail";
import AddBook from "./pages/book/BookForm/BookAdd/BookAddForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import { HomePage } from "./pages/Homepage/HomePage";
import Profile from "./pages/profile/profile";
import Login from "./pages/user/Login/Login";
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
      { path: RouterEnum.REGISTER, element: <Register /> },
      { path: RouterEnum.LOGIN, element: <Login /> },
      {
        path: RouterEnum.ADD_BOOK,
        element: <PrivateRoute element={<AddBook />} />,
      },
      {
        path: RouterEnum.PROFILE,
        element: <PrivateRoute element={<Profile />} />,
      },
      {
        path: RouterEnum.DASHBOARD,
        element: <PrivateRoute element={<Dashboard />} />,
      },
      { path: RouterEnum.BOOK, element: <BookDetail /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
