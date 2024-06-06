import { lazy } from "react";

const Home = lazy(() => import("./components/home"));
const LogIn = lazy(() => import("./components/login"));
const LogOut = lazy(() => import("./components/logout"));
const Register = lazy(() => import("./components/register"));
const Details = lazy(() => import("./components/details"));
const About = lazy(() => import("./components/about"));
const User = lazy(() => import("./components/users"));

const configRoutes = [
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/details", element: <Details /> },
      { path: "/about", element: <About /> },
    ],
  },
  { path: "/user/:id", element: <User /> },
  { path: "/login", element: <LogIn /> },
  { path: "/logout", element: <LogOut /> },
  { path: "/register", element: <Register /> },
];

export default configRoutes;
