import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import configRoutes from "./configRoutes";
import ProtectedRoutes from "./protectedRoutes";

const AppRoutes = () => {
  const notProtect = ["/login", "/logout", "/register", "/user/:id"];
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
