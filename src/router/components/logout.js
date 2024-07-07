import { useEffect } from "react";
import { useAuth } from "../authContext";
import { signOut } from "@aws-amplify/auth";

const LogOut = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    signOut();
  }, [logout]);
  return <div className="component">LogOut Page</div>;
};

export default LogOut;
