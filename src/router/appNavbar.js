import { NavLink } from "react-router-dom";
import { useAuth } from "./authContext";
const AppNavBar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="navMain">
      <ul>
        {!isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Log in
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to="/register"
              >
                Register
              </NavLink>
            </li>{" "}
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to="/logout"
              >
                Log out
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default AppNavBar;
