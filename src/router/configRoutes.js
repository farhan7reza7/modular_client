import { lazy } from "react";

const Home = lazy(() => import("./components/home"));
const LogIn = lazy(() => import("./components/login"));
const LogOut = lazy(() => import("./components/logout"));
const Register = lazy(() => import("./components/register"));
const Details = lazy(() => import("./components/details"));
const About = lazy(() => import("./components/about"));
const User = lazy(() => import("./components/users"));
const Forget = lazy(() => import("./components/forget"));
const Reset = lazy(() => import("./components/reset"));
const NotFound = lazy(() => import("./components/notfound"));
const Otp = lazy(() => import("./components/otp"));

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
  { path: "/forget", element: <Forget /> },
  { path: "/reset", element: <Reset /> },
  { path: "/otp", element: <Otp /> },

  { path: "*", element: <NotFound /> },
];

export default configRoutes;
