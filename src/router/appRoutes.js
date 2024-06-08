import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import configRoutes from "./configRoutes";
import ProtectedRoutes from "./protectedRoutes";
import { useAuth } from "./authContext";

const AppRoutes = () => {
  const { re } = useAuth();
  const notProtect = [
    "/login",
    "/logout",
    "/register",
    "/user/:id",
    "/forget",
    re ? "/reset" : null,
  ];
  const routes = configRoutes.map((el, i) => {
    if (!notProtect.includes(el.path)) {
      if (el.path === "/") {
        return (
          <Route
            path={el.path}
            element={<ProtectedRoutes>{el.element}</ProtectedRoutes>}
            exact
          >
            {el.children &&
              el.children.map((el, i) => (
                <Route path={el.path} element={el.element} />
              ))}
          </Route>
        );
      }
      if (el.path !== "/reset") {
        return (
          <Route
            path={el.path}
            element={<ProtectedRoutes>{el.element}</ProtectedRoutes>}
          >
            {el.children &&
              el.children.map((el, i) => (
                <Route path={el.path} element={el.element} />
              ))}
          </Route>
        );
      } else {
        return null;
      }
    }

    return (
      <Route path={el.path} element={el.element}>
        {el.children &&
          el.children.map((el, i) => (
            <Route path={el.path} element={el.element} />
          ))}
      </Route>
    );
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{routes}</Routes>
    </Suspense>
  );
};

export default AppRoutes;
