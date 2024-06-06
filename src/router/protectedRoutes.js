import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="../login" />;
};

export default ProtectedRoutes;
