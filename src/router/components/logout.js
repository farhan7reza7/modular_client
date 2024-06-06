import { useAuth } from "../authContext";

const LogOut = () => {
  const { logout } = useAuth();
  logout();

  return <div className="component">LogOut Page</div>;
  // return <button onClick={logout}>up</button>;
};

export default LogOut;
