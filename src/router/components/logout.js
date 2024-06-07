import { useEffect } from "react";
import { useAuth } from "../authContext";

const LogOut = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <div className="component">LogOut Page</div>;
};

export default LogOut;
